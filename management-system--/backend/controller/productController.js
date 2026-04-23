import Product from '../models/Product.js';

//create product
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, category, price, stock, image} = req.body;

        const product = await Product.create({
            name,
            description,
            category,
            price,
            stock,
            image,
        });

        return res.status(201).json({
            message: "Product Created Successfully",
            product: product,
        });    
    }
    catch (error) {
        next(error);
    }
};

//get product list
export const getProducts = async (req, res, next) => {
    try {
        const { sort } = req.query;

        let sortOption = { createdAt: -1 };

        if (sort === "price_asc") {
            sortOption = { price: 1 };
        }
        else if (sort === "price_desc") {
            sortOption = { price: -1 };
        }
        else if (sort === "latest") {
            sortOption = { createdAt: -1};
        }

        const products = await Product.find().sort(sortOption);

        return res.status(200).json(products);
    }
    catch(error) {
        next(error);
    }
};

// get sigle product information
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json ({ message: "Product Not Found" });
        }
        return res.status(200).json(product);
    }
    catch(error) {
        next(error);
    }
};


// update product information
export const updateProduct = async (req, res, next) => {
    try {
        const { name, description, category, price, stock, image} = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, category, price, stock, image},
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: " Product not found" });
        }

        return res.status(200).json({
            message: "Product Update Successfully",
            product: updatedProduct,
        })
    }
    catch(error) {
        next(error);
    }
};

// delete product
export const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        } 
        return res.status(200).json({ message: "Product Delete Successfully" });
    }
    catch(error) {
        next(error);
    }
};
