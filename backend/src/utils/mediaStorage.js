import { isCloudinaryConfigured, uploadImageToCloudinary } from './cloudinary.js';
import { saveUploadedFile } from './fileStorage.js';

export const uploadImage = async (input) => {
  if (isCloudinaryConfigured()) {
    return uploadImageToCloudinary(input);
  }

  return saveUploadedFile(input);
};
