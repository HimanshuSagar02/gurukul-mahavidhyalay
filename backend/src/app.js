import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { getUploadsRoot } from './utils/fileStorage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
const frontendIndexFile = path.join(frontendDist, 'index.html');

export const createApp = () => {
  const app = express();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const hasFrontendBuild = fs.existsSync(frontendIndexFile);

  app.use(
    cors({
      origin: clientUrl,
      credentials: true
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(getUploadsRoot()));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/public', publicRoutes);
  app.use('/api/admin', adminRoutes);

  if (hasFrontendBuild) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
      if (
        req.path.startsWith('/api') ||
        req.path.startsWith('/uploads') ||
        path.extname(req.path)
      ) {
        return next();
      }

      res.sendFile(frontendIndexFile);
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
