const mongoose = require("mongoose");
const Order = require("../models/order");
const User = require("../models/user");
const sendOrderConfirmationEmail = require("../utils/sendMail");

const placeOrder = async (req, res) => {
    const { cartItems, shippingAddress, paymentInfo, totalAmount, userId } = req.body;
    console.log("Place Order", req.body);

    try {
        const order = await Order.create({
            userId: userId,
            status: "Processing",
            items: cartItems,
            shippingAddress,
            paymentMethod: paymentInfo?.method || "Unknown",
            paymentStatus: "Paid",
            transactionId: paymentInfo?.transactionId || "Pending",
            total: totalAmount,
            billingAddress: {
                addressLine1 : "Sonia Vihar",
                addressLine2 : "1st Pusta",
                city : "Delhi",
                state : "Delhi",
                postalCode : '110094',
                country: "India"
            },
        });

        await User.findByIdAndUpdate(userId, { cart: [] });
        await sendOrderConfirmationEmail(process.env.Your_Email, order.toObject());

        res.status(200).json({ success: true, order });
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { placeOrder };
