import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controller/productController.js';
import { validate } from '../middlewares/validation.js';
import { verifyToken, checkAdmin } from "../middlewares/auth.js";
import { createProductValidation, updateProductValidation } from '../middlewares/productValidators.js';
const router = express.Router();

//product routes
router.post('/', verifyToken, checkAdmin, createProductValidation, validate, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', verifyToken, checkAdmin, updateProductValidation, validate, updateProduct);
router.delete('/:id', verifyToken, checkAdmin, deleteProduct);

export default router;