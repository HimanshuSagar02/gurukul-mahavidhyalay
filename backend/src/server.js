import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { bootstrapSiteData } from './services/bootstrapService.js';

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  await bootstrapSiteData();

  const app = createApp();
  const server = app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Stop the existing process on that port or change PORT in backend/.env.`
      );
      process.exit(1);
    }

    throw error;
  });
};

startServer().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
