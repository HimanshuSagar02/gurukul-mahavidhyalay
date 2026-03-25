import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDatabase } from '../config/db.js';
import { AdminUser } from '../models/AdminUser.js';

dotenv.config();

const seedAdmin = async () => {
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD must be set in backend/.env');
  }

  await connectDatabase();

  const existing = await AdminUser.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    console.log(`Admin user already exists for ${email}`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await AdminUser.create({
    name: 'Administrator',
    email: email.toLowerCase().trim(),
    passwordHash
  });

  console.log(`Admin user created for ${email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error('Failed to create admin user:', error.message);
  process.exit(1);
});
