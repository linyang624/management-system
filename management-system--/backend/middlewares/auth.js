import jwt from 'jsonwebtoken';
import { AuthError } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    throw new AuthError('No token provided');
  }

  // Expected format: Bearer <token>
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    throw new AuthError('Invalid token');
  }
};

export const checkAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    throw new AuthError('Not authorized as an admin');
  }
};