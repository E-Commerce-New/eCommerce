const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    slug: String,
    description: String,
    price: Number,
    salePrice: Number,
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    sku: String,
    images: [String],
    imagesId: [String],
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    active: Boolean,
    isFeatured: Boolean,
    meta: {
        title: String,
        description: String,
        keywords: String
    },
    attributes: [
        {
            key: String,
            value: String
        }
    ],
    about: String,

    // Physical dimensions
    length: Schema.Types.Double,
    breadth: Schema.Types.Double,
    height: Schema.Types.Double,
    weight: Schema.Types.Double,

    // Ratings & Reviews summary
    averageRating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
