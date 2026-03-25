import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';

const getToken = (req) => {
  const cookieName = process.env.COOKIE_NAME || 'gurukul_admin_token';
  const cookieToken = req.cookies?.[cookieName];
  const authHeader = req.headers.authorization;

  if (cookieToken) {
    return cookieToken;
  }

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
};

export const requireAdminAuth = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const adminUser = await AdminUser.findById(payload.id).select('-passwordHash');

    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    req.adminUser = adminUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};
