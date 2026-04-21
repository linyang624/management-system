import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/error.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    throw new ValidationError(firstError);
  }

  next();
};