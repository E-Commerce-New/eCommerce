const UiCustomize = require('../models/uiCustomize');
const Product = require('../models/product');

const createBanner = async (req, res) => {
    try {
        const {imageUrl, redirectUrl} = req.body;

        let uiCustomize = await UiCustomize.findOne();
        if (!uiCustomize) {
            uiCustomize = new UiCustomize();
        }


        uiCustomize.banners.push({imageUrl, redirectUrl});

        await uiCustomize.save();

        res.status(201).json({success: true, message: "Banner added successfully", data: uiCustomize});
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

const getBanner = async (req, res) => {
    try {
        const uiCustomize = await UiCustomize.findOne();

        if (!uiCustomize) {
            return res.status(404).json({success: false, message: "UiCustomize document not found"});
        }

        res.status(200).json({success: true, data: uiCustomize});
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

const deleteBanner = async (req, res) => {
    const {index} = req.params;
    try {
        const uiCustomize = await UiCustomize.findOne();
        if (!uiCustomize) {
            return res.status(404).json({success: false, message: "UiCustomize document not found"});
        }

        if (index >= 0 && index < uiCustomize.banners.length) {
            uiCustomize.banners.splice(index, 1);
            await uiCustomize.save();
            return res.status(200).json({success: true, message: "Banner deleted successfully", data: uiCustomize});
        }

        res.status(400).json({success: false, message: "Invalid banner index"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Something went wrong!"});
    }
}

const addMainProduct = async (req, res) => {
    const {productIds} = req.body;

    // Validate productIds
    if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({message: 'Invalid product IDs'});
    }

    try {
        const validProducts = await Product.find({'_id': {$in: productIds}});

        if (validProducts.length !== productIds.length) {
            return res.status(404).json({message: 'One or more products not found'});
        }

        const uiCustomize = await UiCustomize.findOne();
        if (!uiCustomize) {
            return res.status(404).json({message: 'UiCustomize document not found'});
        }

        uiCustomize.mainProducts = [];

        uiCustomize.mainProducts = [...new Set([...uiCustomize.mainProducts, ...productIds])];

        await uiCustomize.save();

        res.status(200).json({
            message: 'Products added successfully',
            data: uiCustomize,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Something went wrong', error});
    }
}

module.exports = { createBanner , getBanner , deleteBanner , addMainProduct }

