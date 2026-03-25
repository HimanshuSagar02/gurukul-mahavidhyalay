import { Blob } from 'buffer';
import crypto from 'crypto';

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim().toLowerCase();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary configuration is incomplete. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    );
  }

  return { cloudName, apiKey, apiSecret };
};

const slugifyFileName = (value) =>
  String(value || '')
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';

const signParams = (params, apiSecret) => {
  const signatureBase = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto.createHash('sha1').update(`${signatureBase}${apiSecret}`).digest('hex');
};

export const uploadImageToCloudinary = async ({ buffer, mimeType, originalName, folderName }) => {
  if (!buffer?.length) {
    throw new Error('Image upload buffer is empty.');
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `${Date.now()}-${slugifyFileName(originalName)}`;
  const formData = new FormData();

  formData.append('file', new Blob([buffer], { type: mimeType || 'application/octet-stream' }), originalName || 'image.jpg');
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', folderName);
  formData.append('public_id', publicId);
  formData.append(
    'signature',
    signParams(
      {
        folder: folderName,
        public_id: publicId,
        timestamp
      },
      apiSecret
    )
  );

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.secure_url || !result.public_id) {
    throw new Error(result?.error?.message || 'Cloudinary upload failed.');
  }

  return {
    imageUrl: result.secure_url,
    publicId: result.public_id
  };
};

export const extractCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) {
    return '';
  }

  try {
    const parsedUrl = new URL(imageUrl);

    if (!parsedUrl.hostname.includes('res.cloudinary.com')) {
      return '';
    }

    const uploadSegment = '/upload/';
    const uploadIndex = parsedUrl.pathname.indexOf(uploadSegment);

    if (uploadIndex === -1) {
      return '';
    }

    const publicPath = parsedUrl.pathname
      .slice(uploadIndex + uploadSegment.length)
      .replace(/^v\d+\//, '')
      .replace(/\.[^./]+$/, '');

    return decodeURIComponent(publicPath);
  } catch {
    return '';
  }
};

export const deleteCloudinaryImage = async (input) => {
  const publicId = input?.includes?.('http') ? extractCloudinaryPublicId(input) : input;

  if (!publicId) {
    return;
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const body = new URLSearchParams({
    api_key: apiKey,
    public_id: publicId,
    signature: signParams({ public_id: publicId, timestamp }, apiSecret),
    timestamp: String(timestamp)
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !['ok', 'not found'].includes(result.result)) {
    throw new Error(result?.error?.message || 'Cloudinary delete failed.');
  }
};
