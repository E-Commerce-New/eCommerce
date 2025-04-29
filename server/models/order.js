const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: Schema.Types.ObjectId,
    channel_order_id:Schema.Types.ObjectId,
    order_items:[
        {
            productId: Schema.Types.ObjectId,
            name: String,
            price: Number,
            quantity: Number,
            selling_price:Number,
            sku: String
        }
        ]
        ,
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
    // trackingNumber: String,
    notes: String,
    couponCode: String,
    order_id: Number,
    shipment_id:Number,
    status:String,
    status_code:Number,
    onboarding_completed_now:Number,
    awb_code:String,
    courier_company_id:String,
    courier_name:String,
    new_channel:Boolean,
    packing_box_error:String,
    deliveryCharges:Number,
    createdAt: Date,
    updatedAt: Date
}, {timestamps: true})

module.exports = mongoose.model('Order', orderSchema);

// "order_id": 818383995,
// "channel_order_id": "224-446",
// "shipment_id": 814768418,
// "status": "NEW",
// "status_code": 1,
// "onboarding_completed_now": 0,
// "awb_code": "",
// "courier_company_id": "",
// "courier_name": "",
// "new_channel": false,
// "packaging_box_error": ""