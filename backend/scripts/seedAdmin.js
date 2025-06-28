import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Admin from '../models/AdminModel.js';

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const filePath = path.join(process.cwd(), '..', 'frontend', 'src', 'assets', 'profile_image.jpg');
    const ext = path.extname(filePath).toLowerCase();

    if (ext !== '.jpg' && ext !== '.jpeg') {
      throw new Error('Only .jpg or .jpeg files are supported.');
    }

    const originalBuffer = fs.readFileSync(filePath);
    const metadata = await sharp(originalBuffer).metadata();
    const { width, height } = metadata;

    if (width < 192 || height < 192) {
      throw new Error(`Image too small. Must be at least 192x192, received ${width}x${height}.`);
    }

    let processedBuffer = originalBuffer;
    if (width > 192 || height > 192) {
      processedBuffer = await sharp(originalBuffer)
        .resize(192, 192, {
          fit: 'cover',
        })
        .jpeg()
        .toBuffer();
    }

    const fileName = 'author_img.jpg';

    const upload = await imagekit.upload({
      file: processedBuffer,
      fileName,
      folder: 'authors',
      useUniqueFileName: false,
    });
    const imageUrl = `${upload.url}?v=${Date.now()}`;

    const plainPassword = 'admin';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await Admin.create({
      username: 'admin',
      password: hashedPassword,
      author: 'Ashique Rahman',
      authorImg: imageUrl,
    });

    console.log('Admin account created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin account:', err.message);
    process.exit(1);
  }
}

seedAdmin();

// To run the above code use this command :  node scripts/seedAdmin.js