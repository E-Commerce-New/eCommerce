const mongoose = require('mongoose');
const { Schema } = mongoose;

const UiCustomize = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UiCustomize', UiCustomize);
