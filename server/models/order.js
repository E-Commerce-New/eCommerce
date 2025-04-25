const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: Schema.Types.ObjectId,
    status: String,
    items: [
        {
            productId: Schema.Types.ObjectId,
            name: String,
            price: Number,
            quantity: Number,
            sku: String
        }
    ],
    subTotal: Number,
    tax: Number,
    shippingCost: Number,
    discount: Number,
    total: Number,
    paymentMethod: String,
    paymentStatus: String,
    transactionId: String,
    shippingAddress: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    billingAddress: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    trackingNumber: String,
    notes: String,
    couponCode: String,
    createdAt: Date,
    updatedAt: Date
}, {timestamps: true})

module.exports = mongoose.model('Order', orderSchema);