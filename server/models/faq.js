const mongoose = require('mongoose');
const {Schema} = mongoose;

const faqSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Faq', faqSchema);
