const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: Schema.Types.ObjectId, // Reference to user, null for guest checkout
    status: String, // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    items: [
    {
        productId: Schema.Types.ObjectId,
        name: String, // Product name at time of purchase
        price: Number, // Price at time of purchase
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
    paymentStatus: String, // 'pending', 'completed', 'failed', 'refunded'
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
})

module.exports = mongoose.model('Order', orderSchema);