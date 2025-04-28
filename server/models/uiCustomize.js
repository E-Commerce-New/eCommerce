const mongoose = require('mongoose');
const {Schema} = mongoose;

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
            }
        }
    ],
    mainProducts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    Notice: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UiCustomize', UiCustomize);
