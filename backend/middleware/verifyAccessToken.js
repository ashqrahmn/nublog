import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is NOT defined. Check your .env file.");
}

export default function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, msg: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, msg: "Missing Access Token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(403)
      .json({ success: false, msg: "Invalid or expired access token" });
  }
}