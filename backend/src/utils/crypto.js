import crypto from 'crypto';

const algorithm = 'aes-256-gcm';

const getKey = () => {
  const secret = process.env.DATA_ENCRYPTION_KEY || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('DATA_ENCRYPTION_KEY or JWT_SECRET must be configured.');
  }

  return crypto.createHash('sha256').update(secret).digest();
};

export const encryptValue = (plainText) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decryptValue = (cipherText) => {
  if (!cipherText) {
    return '';
  }

  const [ivHex, authTagHex, encryptedHex] = String(cipherText).split(':');
  const decipher = crypto.createDecipheriv(algorithm, getKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
};
