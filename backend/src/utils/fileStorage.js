import fs from 'fs';
import path from 'path';
import { deleteCloudinaryImage, extractCloudinaryPublicId } from './cloudinary.js';

const uploadsRoot = path.resolve(process.cwd(), 'uploads');

export const ensureDirectory = (targetPath) => {
  fs.mkdirSync(targetPath, { recursive: true });
};

export const getUploadsRoot = () => {
  ensureDirectory(uploadsRoot);
  return uploadsRoot;
};

export const deleteUploadedFile = async (fileUrl, cloudinaryPublicId = '') => {
  const publicId = cloudinaryPublicId || extractCloudinaryPublicId(fileUrl);

  if (publicId) {
    await deleteCloudinaryImage(publicId);
    return;
  }

  if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
    return;
  }

  const absolutePath = path.resolve(process.cwd(), fileUrl.replace(/^\//, ''));
  const normalizedRoot = path.normalize(getUploadsRoot());
  const normalizedFile = path.normalize(absolutePath);

  if (!normalizedFile.startsWith(normalizedRoot)) {
    return;
  }

  try {
    await fs.promises.unlink(normalizedFile);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};
