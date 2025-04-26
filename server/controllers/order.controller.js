const mongoose = require("mongoose");
const Order = require("../models/order");
const User = require("../models/user");
const { sendOrderConfirmationEmail } = require("../utils/sendMail");
const { updateProductStock } = require("./product.controller");

const placeOrder = async (req, res) => {
    const { cartItems, shippingAddress, paymentInfo, totalPrice, userId } = req.body;
    console.log("Place Order", req.body);

    try {
        // Step 1: Reduce stock before order is created
        await updateProductStock(cartItems);

        // Step 2: Create order
        const order = await Order.create({
            userId,
            status: "Processing",
            items: cartItems,
            shippingAddress,
            paymentMethod: "Razorpay",
            paymentStatus: "Paid",
            transactionId: paymentInfo?.razorpay_payment_id || "Pending",
            total: totalPrice,
            billingAddress: {
                addressLine1 : "Sonia Vihar",
                addressLine2 : "1st Pusta",
                city : "Delhi",
                state : "Delhi",
                postalCode : '110094',
                country: "India"
            },
        });

        console.log("Order Saved", order);

        await User.findByIdAndUpdate(userId, { cart: [] });
        await sendOrderConfirmationEmail(process.env.Your_Email, order.toObject());

        res.status(200).json({ success: true, order });

    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};



const getOrdersById = async (req, res) => {
    try {
        const userId = req.body._id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const orders = await Order.find({ userId: userId });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getOrders = async (req, res) => {
    const orders = await Order.find({});

    res.status(200).json(orders);
}

const getTotalRevenue = async (req, res) => {
    try {
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
        res.json({ revenue: totalRevenue });
    } catch (err) {
        res.status(500).json({ message: 'Error calculating revenue' });
    }
};

module.exports = { placeOrder  , getOrdersById , getOrders , getTotalRevenue};
