const Product = require("../models/product");
const Category = require("../models/category");
const {Types} = require("mongoose");
const {uploadFiles, deleteFiles} = require("../helper/fileHandelers");


//Validations: Empty fields, 1 image required(Commented right now),
const createProducts = async (req, res) => {

    try {
        if (req.isAdmin) {
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
                length,
                breadth,
                height,
                weight,
                about
            } = req.body;


            // List of required fields
            const requiredFields = {
                name,
                description,
                category,
                price,
                quantity,
                active,
                attributes,
                length,
                breadth,
                height,
                weight,
                about,
            };
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
            const imagesURL = images.filePath
            const imagesId = images.fileId
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
                images: imagesURL,
                imagesId,
                length,
                breadth,
                height,
                weight,
                about

            });
            await product.save();
            return res.status(200).json({message: 'Product Created Successfully'});
        } else {
            return res.status(401).json({message: 'Unauthorized'});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

const getProducts = async (req, res) => {
    try {
        const data = await Product.find({ active: true });
        res.status(200).json({ data, message: 'Products fetched successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong...');
    }
};


const updateProduct = async (req, res) => {
    try {
        if (req.isAdmin) {
            const {
                name,
                description,
                category,
                price,
                quantity,
                active,
                attributes,
                imagesArr,
                fileId,
                deleteImageArr,
                weight,
                height,
                breadth,
                length,
                about
            } = req.body;

            // console.log("Images Array: ", JSON.parse(imagesArr), imagesArr)
            // console.log('FileID : ', JSON.parse(fileId))
            // console.log('Delete Image Array: ', deleteImageArr)
            //
            const uploadFile = await uploadFiles(req.files);
            const gotFilePath = uploadFile.filePath;
            const gotFileId = uploadFile.fileId;
            const parsedAttributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
            //
            const imgArr = JSON.parse(imagesArr);
            const fileIdArr = JSON.parse(fileId);
            const deleteFilesArr = JSON.parse(deleteImageArr);
            //
            // console.log("File Path: ", ...imgArr, ...gotFilePath)
            // console.log("File Id: ", ...fileIdArr, ...gotFileId)
            //
            //
            const updateData = {
                name,
                description,
                category,
                price,
                quantity,
                active,
                attributes: parsedAttributes,
                images: [...imgArr, ...gotFilePath],
                imagesId: [...fileIdArr, ...gotFileId],
                weight,
                height,
                breadth,
                length,
                about
            };

            // console.log(" imgArr ", imgArr)
            // console.log('Final images array and file path: ' , imagesArr, filePath)

            // console.log("Images: ", updateData.images)
            await Product.findByIdAndUpdate(req.params.id, updateData);

            const product = await Product.findById(req.params.id);
            res.status(200).json({ message: 'Product updated successfully'});

            // const deleteFilesArr = JSON.parse(req.body.deleteImageArr);
            // console.log("Delete Files: ", deleteFilesArr)
            await deleteFiles(deleteFilesArr);
        } else {
            return res.status(401).json({message: 'Unauthorized'});
        }
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
        return res.status(400).json({error: "Invalid or missing Product ID"});
    }

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({error: "Product not found"});

        return res.status(200).json({data: product});
    } catch (error) {
        console.error("MongoDB Error:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
};


const addCategory = async (req, res) => {
    try {
        if (req.isAdmin) {
            const {category} = req.body;
            const newCat = new Category({category});
            await newCat.save();
            res.status(200).json({message: "Category added successfully", category: newCat});
        } else {
            return res.status(401).json({message: 'Unauthorized'});
        }
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

const updateProductStock = async (cartItems) => {
    for (const item of cartItems) {
        const product = await Product.findById(item._id);

        if (!product) {
            throw new Error(`Product with ID ${item._id} not found`);
        }

        if (product.quantity < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
        }

        product.quantity -= item.quantity;
        await product.save();
    }
};

const updateisactive = async (req, res) => {
    try {
        const id = req.body?.id;
        console.log(id);

        const product = await Product.findById(id);
        console.log(product);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.active = !product.active;
        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}



// const deleteCategory = async (req, res) => {
//     console.log(req.params.id);
// }

module.exports = {deleteProduct, updateProduct, getProducts, createProducts, getProductById, addCategory, getCategories , updateProductStock , updateisactive}