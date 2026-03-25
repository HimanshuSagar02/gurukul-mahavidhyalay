import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      trim: true,
      default: ''
    },
    caption: {
      type: String,
      trim: true,
      default: ''
    },
    photoOf: {
      type: String,
      trim: true,
      default: ''
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
