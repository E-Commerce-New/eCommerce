const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({
    name: String,
    slug: String,
    description: String,
    price: Number,
    salePrice: Number,
    quantity: Number,
    sku: String,
    images: [String], // URLs to images
    category: String,
    active: Boolean,
    isFeatured: Boolean,
    createdAt: Date,
    updatedAt: Date,
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
    ]
})

module.exports = mongoose.model('Product', productSchema)