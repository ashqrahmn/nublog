import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  authorImg: {
    type: String,
    required: true,
  },
  imagekitFileId: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.blog || mongoose.model("blog", BlogSchema);