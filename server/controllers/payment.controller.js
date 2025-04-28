const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../models/payment");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, res) => {
    const {amount} = req.body;
    console.log("create Order", req.body);

    const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: 'receipt#1',
    };

    try {
        const order = await instance.orders.create(options);
        console.log("Order Saved", order);
        return res.status(200).json({success: true, order});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error});
    }
}

const verifyOrder = async (req, res) => {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount} = req.body;
    console.log("Verify Order", req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        try {
            const payment = await Payment.create({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                user: userId,
                status: "success",
                amount,
            });
            console.log("Verify Order and Payment saved", payment);
            return res.status(200).json({
                success: true,
                message: "Payment verified and saved!",
                payment,
            });
        } catch (error) {
            console.error("Error saving payment:", error);
            return res.status(500).json({
                success: false,
                message: "Payment verified but saving to DB failed.",
                error,
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Invalid payment signature.",
        });
    }
};


module.exports = {verifyOrder, createOrder}