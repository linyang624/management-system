import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controller/productController.js';
import { validate } from '../middlewares/validation.js';
import { verifyToken, checkAdmin } from "../middlewares/auth.js";
import { createProductValidation, updateProductValidation } from '../middlewares/productValidators.js';
const router = express.Router();

//auth routes
router.post('/signin', signInValidation, validate, signIn);
router.post('/signup', signUpValidation, validate,signUp);
router.put('/update-password', updatePasswordValidation, validate, updatePassword);
router.post('/logout', logOut);

//module.exports = router;
export default router;