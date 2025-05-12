const Review = require("../models/Reviews");
const Product = require("../models/product");

const createReview = async (req, res) => {
    const { productId, userId, rating, comment } = req.body;

    try {
        const existing = await Review.findOne({ productId, userId });
        if (existing) return res.status(400).json({ message: "You already reviewed this product" });

        const review = await Review.create({ productId, userId, rating, comment });

        const reviews = await Review.find({ productId });
        const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

        await Product.findByIdAndUpdate(productId, {
            averageRating: avgRating,
            reviewCount: reviews.length
        });

        res.status(201).json({ message: "Review added", review });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId })
            .sort({ createdAt: -1 })
            .select("rating comment createdAt");

        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
    }
};

module.exports = { createReview , getReviewsByProduct }
