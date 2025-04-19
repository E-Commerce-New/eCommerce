const Product = require("../models/product");

const createProducts = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const {
            name,
            description,
            category,
            price,
            quantity,
            active,
            attributes,
        } = req.body;

        const parsedAttributes = JSON.parse(attributes);

        const product = new Product({
            name,
            description,
            category,
            price: Number(price),
            quantity: Number(quantity),
            active: active === 'true',
            attributes: parsedAttributes,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await product.save();
        return res.status(200).json({message: 'Product Created Successfully'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

const getProducts = async (req, res) => {
    try {
        const data = await Product.find({})
        res.status(200).json({data, message: 'Products fetched successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong...')
    }
}

const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            price,
            quantity,
            active,
            attributes
        } = req.body;
        await Product.findByIdAndUpdate(req.params.id, {
            name,
            description,
            category,
            price,
            quantity,
            active,
            attributes
        })
        const product = await Product.findById(req.params.id)
        res.status(200).json({product, message: 'Product updated successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong...')
    }
}

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'Product deleted successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong...')
    }
}
const getProductById = async (req, res) => {
    try {
        const data = await Product.findById(req.params.id)
        res.status(200).json({data, message: 'Product fetched successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong...')
    }
}
module.exports = {deleteProduct, updateProduct, getProducts, createProducts, getProductById}