const mongoose = require('mongoose');
const {Schema} = mongoose;

const categorySchema = new Schema({
    category: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: { type: String,
        //required: true,
        unique: true }, // for URLs
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    description: String,
    icon: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
