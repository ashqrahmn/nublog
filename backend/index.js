import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sharp from "sharp";
import path from "path";

import EmailModel from "./models/EmailModel.js";
import AdminModel from "./models/AdminModel.js";
import BlogModel from "./models/BlogModel.js";
import CategoryModel from "./models/CategoryModel.js";
import verifyAccessToken from "./middleware/verifyAccessToken.js";
import upload from "./middleware/upload.js";
import ImageKit from "imagekit";
import { sendNewPostEmail } from "./utils/sendNewPostEmail.js";
import verifyRefreshToken from "./middleware/verifyRefreshToken.js";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const app = express();

app.use(express.json());

const allowedOrigins = [process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")];
console.log("Allowed Origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    const cleanOrigin = origin?.replace(/\/$/, "");
    console.log("Request from Origin:", cleanOrigin);
    if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    } else {
      console.log("Blocked Origin:", cleanOrigin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Subscribe Email
app.post("/email", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, msg: "Email is required" });
    }

    const exists = await EmailModel.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, msg: "Email already subscribed" });
    }

    await EmailModel.create({ email });
    return res.json({ success: true, msg: "Email subscribed successfully" });
  } catch (error) {
    console.error("POST /email Error:", error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, msg: "Email already subscribed" });
    }
    return res
      .status(500)
      .json({ success: false, msg: "Something went wrong" });
  }
});

// Get all subscribed emails
app.get("/email", verifyAccessToken, async (req, res) => {
  try {
    const emails = await EmailModel.find({});
    return res.json({ success: true, emails });
  } catch (error) {
    console.error("GET /email Error:", error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Failed to fetch emails" });
  }
});

// Delete email
app.delete("/email", verifyAccessToken, async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ success: false, msg: "ID is required" });
    }
    await EmailModel.findByIdAndDelete(id);
    return res.json({ success: true, msg: "Email deleted successfully" });
  } catch (error) {
    console.error("DELETE /email Error:", error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Failed to delete email" });
  }
});

// Unsubscribe
app.get("/unsubscribe", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    await EmailModel.deleteOne({ email });
    return res.json({ success: true, message: "You have been unsubscribed" });
  } catch (error) {
    console.error("GET /unsubscribe Error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

// Get categories
app.get("/get-categories", async (req, res) => {
  try {
    const categories = await CategoryModel.find({}, "name");
    return res.json({ success: true, categories });
  } catch (error) {
    console.error("GET /get-categories Error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Failed to fetch categories" });
  }
});

// Add category
app.post("/category", verifyAccessToken, async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    if (!name) {
      return res.status(400).json({ success: false, msg: "Name is required" });
    }
    const exists = await CategoryModel.findOne({ name });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, msg: "Category already exists" });
    }
    await CategoryModel.create({ name });
    return res.json({ success: true, msg: "Category added successfully" });
  } catch (error) {
    console.error("POST /category Error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Failed to add category" });
  }
});

// Delete category
app.delete("/category", async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Category ID is required" });
    }
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }
    await CategoryModel.findByIdAndDelete(id);
    return res.json({ success: true, msg: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE /category Error:", error);
    return res.status(500).json({ success: false, msg: "Delete failed" });
  }
});

// Add blog
app.post("/blog", verifyAccessToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const image = req.file;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, msg: "Title is required" });
    }
    if (!description || !description.trim()) {
      return res
        .status(400)
        .json({ success: false, msg: "Description is required" });
    }
    if (!category || !category.trim()) {
      return res
        .status(400)
        .json({ success: false, msg: "Category is required" });
    }

    if (!image || !image.buffer) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid image file" });
    }
    if (!image.mimetype.includes("jpeg") && !image.mimetype.includes("jpg")) {
      return res
        .status(400)
        .json({ success: false, msg: "Only JPEG images are allowed" });
    }

    const metadata = await sharp(image.buffer).metadata();
    const { width, height } = metadata;

    if (!width || !height) {
      return res
        .status(400)
        .json({ success: false, msg: "Unable to read image dimensions" });
    }

    if (width < 1280 || height < 720) {
      return res.status(400).json({
        success: false,
        msg: "Image must be at least 1280x720 in dimensions",
      });
    }

    let finalBuffer;
    if (width > 1280 || height > 720) {
      finalBuffer = await sharp(image.buffer)
        .resize(1280, 720, { fit: "cover" })
        .jpeg({ quality: 90 })
        .toBuffer();
    } else {
      finalBuffer = image.buffer;
    }

    const originalName = path.parse(image.originalname).name;
    const filename = `${Date.now()}_${originalName}.jpg`;

    const uploadRes = await imagekit.upload({
      file: finalBuffer,
      fileName: filename,
      folder: "/blogs",
    });

    const admin = await AdminModel.findOne().lean();
    if (!admin || !admin.author || !admin.authorImg) {
      return res
        .status(500)
        .json({ success: false, msg: "Admin details missing" });
    }

    const blogData = {
      title,
      description,
      category,
      image: uploadRes.url,
      imagekitFileId: uploadRes.fileId,
      author: admin.author,
      authorImg: admin.authorImg,
    };

    const newBlog = await BlogModel.create(blogData);

    sendNewPostEmail({
      id: newBlog._id,
      title,
      category,
      image: uploadRes.url,
    }).catch((error) => console.error("Error sending new post email:", error));

    return res.json({ success: true, msg: "Blog Added Successfully" });
  } catch (error) {
    console.error("POST /blog Error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Something went wrong" });
  }
});

// Get blogs
app.get("/get-blogs", async (req, res) => {
  const id = req.query.id;
  try {
    const admin = await AdminModel.findOne().lean();
    if (!admin) {
      return res.status(500).json({ success: false, msg: "Admin not found" });
    }

    if (id) {
      const blog = await BlogModel.findById(id).lean();
      if (!blog) {
        return res.status(404).json({ success: false, msg: "Blog not found" });
      }
      return res.json({
        ...blog,
        author: admin.author,
        authorImg: admin.authorImg,
      });
    } else {
      const blogs = await BlogModel.find({}).lean();
      const updatedBlogs = blogs.map((blog) => ({
        ...blog,
        author: admin.author,
        authorImg: admin.authorImg,
      }));
      return res.json({ blogs: updatedBlogs });
    }
  } catch (error) {
    console.error("GET /get-blogs Error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
});

// Delete blog
app.delete("/blog", verifyAccessToken, async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Blog ID is required" });
    }

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found" });
    }

    if (blog.imagekitFileId) {
      try {
        await imagekit.deleteFile(blog.imagekitFileId);
      } catch (err) {
        console.error("ImageKit delete failed:", err.message);
      }
    }

    await BlogModel.findByIdAndDelete(id);
    return res.json({ success: true, msg: "Blog deleted successfully" });
  } catch (error) {
    console.error("DELETE /blog Error:", error);
    return res.status(500).json({ success: false, msg: "Delete failed" });
  }
});

// Admin Login
app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Username and password are required" });
    }

    const admin = await AdminModel.findOne({ username });
    if (!admin) {
      return res
        .status(401)
        .json({
          success: false,
          msg: "Username is incorrect",
          errorField: "username",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({
          success: false,
          msg: "Password is incorrect",
          errorField: "password",
        });
    }

    const accessToken = jwt.sign({ adminId: admin._id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ adminId: admin._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      msg: "Logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.error("POST /admin/login Error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
});

// Admin Refresh Token
app.post("/admin/refresh", verifyRefreshToken, async (req, res) => {
  const admin = await AdminModel.findById(req.adminId);
  if (!admin) {
    return res
      .status(403)
      .json({ success: false, msg: "Admin no longer exists" });
  }

  const newAccessToken = jwt.sign({ adminId: admin._id }, JWT_SECRET, {
    expiresIn: "15m",
  });
  const newRefreshToken = jwt.sign({ adminId: admin._id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({ success: true, accessToken: newAccessToken });
});

// Get Admin Info
app.get("/admin", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await AdminModel.findById(decoded.adminId);
    if (!admin) {
      return res.status(404).json({ success: false, msg: "Admin not found" });
    }

    return res.json({
      success: true,
      admin: {
        authorImg: admin.authorImg,
        username: admin.username,
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, msg: "Invalid token" });
  }
});

app.post("/admin/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return res.json({ success: true, msg: "Logged out successfully" });
});

// Upload profile image
app.post("/upload-image", verifyAccessToken, upload.single("image"), async (req, res) => {
    try {
      const image = req.file;
      const fileName = req.body.fileName;

      if (!image || !fileName) {
        return res
          .status(400)
          .json({ success: false, msg: "Image and fileName are required" });
      }

      if (!["image/jpeg", "image/jpg"].includes(image.mimetype)) {
        return res
          .status(400)
          .json({ success: false, msg: "Only JPEG images are supported" });
      }

      const metadata = await sharp(image.buffer).metadata();
      const { width, height } = metadata;

      if (width < 192 || height < 192) {
        return res.status(400).json({
          success: false,
          msg: `Image too small. Must be at least 192x192, received ${width}x${height}.`,
        });
      }

      let finalBuffer = image.buffer;
      if (width > 192 || height > 192) {
        finalBuffer = await sharp(image.buffer)
          .resize(192, 192, { fit: "cover" })
          .png()
          .toBuffer();
      }

      const listResponse = await imagekit.listFiles({ limit: 100 });
      const existingFile = listResponse.find(
        (file) =>
          file.name === fileName && file.filePath === `/authors/${fileName}`
      );
      if (existingFile) {
        await imagekit.deleteFile(existingFile.fileId);
      }

      const uploadResponse = await imagekit.upload({
        file: finalBuffer,
        fileName,
        folder: "/authors",
        useUniqueFileName: false,
      });

      const imageUrl = `${uploadResponse.url}?v=${Date.now()}`;

      await AdminModel.findOneAndUpdate(
        {},
        { authorImg: imageUrl },
        { new: true }
      );

      return res.json({ success: true, url: imageUrl });
    } catch (error) {
      console.error("POST /upload-image Error:", error);
      return res
        .status(500)
        .json({ success: false, msg: error.message || "Server error" });
    }
  }
);

// Update admin password
app.post("/update-password", verifyAccessToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "New password must be at least 8 characters long",
        });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        msg: "New password must be different from the current password",
      });
    }

    const admin = await AdminModel.findOne();
    if (!admin) {
      return res.status(404).json({ success: false, msg: "Admin not found" });
    }

    const isCurrentValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isCurrentValid) {
      return res
        .status(400)
        .json({ success: false, msg: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    return res.json({ success: true, msg: "Password updated successfully" });
  } catch (error) {
    console.error("POST /update-password Error:", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

// Health Check Endpoint
app.get("/ping", (req, res) => {
  res.status(200).send("Pong");
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  if (err.message === "Not allowed by CORS") {
    return res
      .status(403)
      .json({ error: "CORS error: Request not allowed from this origin." });
  }
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});