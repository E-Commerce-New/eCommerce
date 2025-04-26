const express = require('express');
const router = express.Router();
const UiCustomize = require('../models/uiCustomize');

// Create Banner
router.post('/create', async (req, res) => {
    try {
        const { imageUrl, redirectUrl } = req.body;

        const newBanner = new UiCustomize({ imageUrl, redirectUrl });
        await newBanner.save();

        res.status(201).json({ success: true, message: "Banner created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Get Banners
router.get('/get', async (req, res) => {
    try {
        const banners = await UiCustomize.find({ active: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, banners });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const bannerId = req.params.id;
        await UiCustomize.findByIdAndDelete(bannerId);
        return res.status(200).json({ success: true, message: "Banner deleted successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Something went wrong!" });
    }
})


module.exports = router;