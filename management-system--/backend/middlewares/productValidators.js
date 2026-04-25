import { body } from 'express-validator';

/* Defines validation rules for product creation and update, 
so invalid product data will not enter the controller. */

// create product
export const createProductValidation = [
    body('name')
        .notEmpty()
        .withMessage('Product Name is Required'),

    body('description')
        .notEmpty()
        .withMessage('Description is Required'),
    
    body('category')
        .notEmpty()
        .withMessage('Category is Required'),

    body('price')
        .notEmpty()
        .withMessage('Price is Required')
        .isFloat({ gt: 0 })
        .withMessage("Price must be a number greater than 0"),

    body('stock')
        .notEmpty()
        .withMessage('Stock is Required')
        .isInt({ min: 0 })
        .withMessage("Stock must be an integer greater than or equal to 0"),

    body('image')
        .notEmpty()
        .withMessage('Image Link is Required')
        .isURL()
        .withMessage("Image link must be a valid URL"),
]

// update product
export const updateProductValidation = [
    body('name')
        .notEmpty()
        .withMessage('Product Name is Required'),

    body('description')
        .notEmpty()
        .withMessage('Description is Required'),
    
    body('category')
        .notEmpty()
        .withMessage('Category is Required'),

    body('price')
        .notEmpty()
        .withMessage('Price is Required')
        .isFloat({ gt: 0 })
        .withMessage("Price must be a number greater than 0"),

    body('stock')
        .notEmpty()
        .withMessage('Stock is Required')
        .isInt({ min: 0 })
        .withMessage("Stock must be an integer greater than or equal to 0"),

    body('image')
        .notEmpty()
        .withMessage('Image Link is Required')
        .isURL()
        .withMessage("Image link must be a valid URL"),
]
