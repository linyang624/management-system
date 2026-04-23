import express from 'express';
import { signIn, signUp, updatePassword, logOut } from '../controller/authController.js';
import { validate } from '../middlewares/validation.js';
import { verifyToken } from "../middlewares/auth.js";
import { signInValidation, signUpValidation, updatePasswordValidation } from '../middlewares/authValidators.js';
const router = express.Router();

//auth routes
router.post('/signin', signInValidation, validate, signIn);
router.post('/signup', signUpValidation, validate,signUp);
router.put('/update-password', updatePasswordValidation, validate, updatePassword);
router.post('/logout', verifyToken , logOut);

//module.exports = router;
export default router;