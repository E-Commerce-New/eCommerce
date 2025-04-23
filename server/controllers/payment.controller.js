import crypto from "crypto";
import Razorpay from "razorpay";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: 'receipt#1',
    };

    try {
        const order = await instance.orders.create(options);
        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error });
    }
}

const verifyOrder = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false });
    }
}

export { createOrder , verifyOrder };