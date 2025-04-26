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
    images: [String],
    imagesId:[String],
    category: String,
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
    length: Schema.Types.Double,
    breadth: Schema.Types.Double,
    height: Schema.Types.Double,
    weight: Schema.Types.Double

}, { timestamps: true });



module.exports = mongoose.model('Product', productSchema);