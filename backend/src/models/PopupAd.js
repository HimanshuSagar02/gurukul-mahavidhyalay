import mongoose from 'mongoose';

const popupAdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: 'Latest Update'
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
      default: ''
    },
    redirectUrl: {
      type: String,
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const PopupAd = mongoose.model('PopupAd', popupAdSchema);
