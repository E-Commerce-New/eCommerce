const mongoose = require('mongoose');
const { Schema } = mongoose;

const UiCustomize = new mongoose.Schema({
    banners: [
        {
            imageUrl: {
                type: String,
                required: true
            },
            redirectUrl: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            active: {
                type: Boolean,
                default: true
            }
        }
    ],
    mainProducts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UiCustomize', UiCustomize);
