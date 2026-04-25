import { body } from 'express-validator';

//Defines validation rules for authentication-related requests

//signin
export const signInValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

//signup
export const signUpValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
    .withMessage('Password must contain letters and numbers and be at least 6 characters long'),
];

//update-password
export const updatePasswordValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
];