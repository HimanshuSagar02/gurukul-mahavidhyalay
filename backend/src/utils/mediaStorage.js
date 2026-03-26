import { isCloudinaryConfigured, uploadImageToCloudinary } from './cloudinary.js';
import { saveUploadedFile } from './fileStorage.js';

export const uploadImage = async (input) => {
  if (isCloudinaryConfigured()) {
    try {
      return await uploadImageToCloudinary(input);
    } catch {
      return saveUploadedFile(input);
    }
  }

  return saveUploadedFile(input);
};
