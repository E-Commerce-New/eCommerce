const Product = require("../models/product");
const Category = require("../models/category");
const {Types} = require("mongoose");
const {uploadFiles, deleteFiles} = require("../helper/fileHandelers");


//Validations: Empty fields, 1 image required(Commented right now),
const createProducts = async (req, res) => {
    try {
        // console.log("BODY:", req.body);
        // console.log("FILE:", req.files);
        const {
            name,
            description,
            category,
            price,
            quantity,
            active,
            attributes,
        } = req.body;

        // List of required fields
        const requiredFields = {name, description, category, price, quantity, active, attributes};

        // Check for missing or empty values
        for (const [key, value] of Object.entries(requiredFields)) {
            if (
                value === undefined || (typeof value === 'string' && value.trim() === '')
            ) {
                return res.status(400).json({message: `Empty field: ${key.charAt(0).toUpperCase() + key.slice(1)}`});
            }
        }

        const parsedAttributes = JSON.parse(attributes);

        const images = await uploadFiles(req.files)

        // console.log("Images: ", images)

        //Atleast one image is required.
        // if(images.length === 0){
        //     return res.status(400).json({message: "Please upload atleast one Image."})
        // }

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
            attributes,
            imagesArr
        } = req.body;

        // console.log("Images Array: ", JSON.parse(imagesArr))
        // console.log('Req.files: ', typeof req.files)

        const filePath = await uploadFiles(req.files)

        const parsedAttributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes;

        const imgArr = JSON.parse(imagesArr)

        const updateData = {
            name,
            description,
            category,
            price,
            quantity,
            active,
            attributes: parsedAttributes,
            images: [...imgArr, ...filePath]
        };


        // console.log(" imgArr ", imgArr)
        // console.log('Final images array and file path: ' , imagesArr, filePath)

        // console.log("Images: ", updateData.images)
        await Product.findByIdAndUpdate(req.params.id, updateData);

        const product = await Product.findById(req.params.id);
        res.status(200).json({ product, message: 'Product updated successfully', filePath});
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
    const id = req.body?.id;

    if (!id || !Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid or missing Product ID" });
    }

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        return res.status(200).json({ data: product });
    } catch (error) {
        console.error("MongoDB Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const addCategory = async (req, res) => {
    try {
        const {category} = req.body;
        const newCat = new Category({category});
        await newCat.save();
        res.status(200).json({message: "Category added successfully", category: newCat});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error saving category"});
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({success: true, categories});
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({success: false, message: 'Failed to fetch categories'});
    }
};


// const deleteCategory = async (req, res) => {
//     console.log(req.params.id);
// }

module.exports = {deleteProduct, updateProduct, getProducts, createProducts, getProductById, addCategory, getCategories }