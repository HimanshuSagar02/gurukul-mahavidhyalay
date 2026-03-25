import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    overview: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      trim: true,
      default: ''
    },
    eligibility: {
      type: String,
      trim: true,
      default: ''
    },
    subjects: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);
