import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.email || mongoose.model('email', EmailSchema);