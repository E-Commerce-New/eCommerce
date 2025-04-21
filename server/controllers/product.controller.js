const Product = require("../models/product");
const multer = require("multer");
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/0Shivams',
    publicKey: 'public_nwv07BA1aDK003/hEjq8qhETyD0=',
    privateKey: 'private_MWxjVnMznc/cAad06gnaPFHKCdc='
});

const createProducts = async (req, res) => {
    try {
        console.log("Create Products")
        console.log("FILES:", req.files);
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

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

        const images = []

        let i = 0;

        for(const file of req.files){
            console.log("file : ",i++, "buffer :", file.buffer, "name :",file.originalname);
            const fileBuff = file?.buffer
            if (fileBuff) {
                    const result = await imagekit.upload({
                        file: fileBuff,//<url|base_64|binary>, //required
                        fileName: file.originalname,   //required
                    });
                    console.log("Result", result)
                    images.push(result.filePath)
                }

        }
        console.log("Images: ", images)
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
            images
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

        const parsedAttributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes;

        const updateData = {
            name,
            description,
            category,
            price,
            quantity,
            active,
            attributes: parsedAttributes
        };

        await Product.findByIdAndUpdate(req.params.id, updateData);

        const product = await Product.findById(req.params.id);
        res.status(200).json({product, message: 'Product updated successfully'});
    } catch (error) {
        console.log("Update Error:", error);
        res.status(500).send('Something went wrong...');
    }
};

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