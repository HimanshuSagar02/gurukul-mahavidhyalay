import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const fallbackUri = 'mongodb://127.0.0.1:27017/gurukul-mahavidyalay';
  const uri = process.env.MONGODB_URI || (process.env.NODE_ENV !== 'production' ? fallbackUri : '');

  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Set it in backend/.env for production deployments.');
  }

  await mongoose.connect(uri);
  return mongoose.connection;
};
