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
const publicRoutesForSeo = ['/', '/about', '/courses', '/admissions', '/notifications', '/gallery', '/contact'];

const getPublicBaseUrl = (req) => {
  const explicitSiteUrl = process.env.PUBLIC_SITE_URL?.trim();

  if (explicitSiteUrl) {
    return explicitSiteUrl.replace(/\/$/, '');
  }

  const forwardedProto = req.get('x-forwarded-proto');
  const protocol = forwardedProto ? forwardedProto.split(',')[0].trim() : req.protocol;
  return `${protocol}://${req.get('host')}`;
};

const buildSitemapXml = (baseUrl) => {
  const lastModified = new Date().toISOString();
  const urlEntries = publicRoutesForSeo
    .map((routePath) => {
      const fullUrl = `${baseUrl}${routePath === '/' ? '' : routePath}`;
      const priority = routePath === '/' ? '1.0' : '0.8';

      return [
        '  <url>',
        `    <loc>${fullUrl}</loc>`,
        `    <lastmod>${lastModified}</lastmod>`,
        '    <changefreq>weekly</changefreq>',
        `    <priority>${priority}</priority>`,
        '  </url>'
      ].join('\n');
    })
    .join('\n');

  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', urlEntries, '</urlset>'].join('\n');
};

export const createApp = () => {
  const app = express();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const hasFrontendBuild = fs.existsSync(frontendIndexFile);

  app.set('trust proxy', 1);

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

  app.get('/robots.txt', (req, res) => {
    const baseUrl = getPublicBaseUrl(req);
    res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml').send(buildSitemapXml(getPublicBaseUrl(req)));
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
