import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { deleteCloudinaryImage, extractCloudinaryPublicId, isCloudinaryConfigured } from './cloudinary.js';

const uploadsRoot = path.resolve(process.cwd(), 'uploads');
const imageExtensionMap = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif']
]);

export const ensureDirectory = (targetPath) => {
  fs.mkdirSync(targetPath, { recursive: true });
};

export const getUploadsRoot = () => {
  ensureDirectory(uploadsRoot);
  return uploadsRoot;
};

const slugifySegment = (value, fallback = 'image') =>
  String(value || '')
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || fallback;

const normalizeFolderName = (folderName) => {
  const normalized = String(folderName || 'media')
    .split(/[\\/]+/)
    .map((segment) => slugifySegment(segment, ''))
    .filter(Boolean)
    .join('/');

  return normalized || 'media';
};

const getFileExtension = (mimeType, originalName) => {
  const originalExtension = path.extname(String(originalName || '')).replace(/^\./, '').trim().toLowerCase();

  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(originalExtension)) {
    return originalExtension === 'jpeg' ? 'jpg' : originalExtension;
  }

  return imageExtensionMap.get(mimeType) || 'jpg';
};

export const saveUploadedFile = async ({ buffer, mimeType, originalName, folderName }) => {
  if (!buffer?.length) {
    throw new Error('Image upload buffer is empty.');
  }

  const normalizedFolder = normalizeFolderName(folderName);
  const targetDirectory = path.join(getUploadsRoot(), ...normalizedFolder.split('/'));
  const baseName = slugifySegment(originalName, 'image');
  const uniqueToken = crypto.randomUUID?.() || crypto.randomBytes(8).toString('hex');
  const extension = getFileExtension(mimeType, originalName);
  const fileName = `${Date.now()}-${uniqueToken}-${baseName}.${extension}`;

  ensureDirectory(targetDirectory);
  await fs.promises.writeFile(path.join(targetDirectory, fileName), buffer);

  return {
    imageUrl: `/uploads/${normalizedFolder}/${fileName}`,
    publicId: ''
  };
};

export const deleteUploadedFile = async (fileUrl, cloudinaryPublicId = '') => {
  const publicId = cloudinaryPublicId || extractCloudinaryPublicId(fileUrl);

  if (publicId) {
    if (!isCloudinaryConfigured()) {
      return;
    }

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
