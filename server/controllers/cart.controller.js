const User = require("../models/user");

const increaseCartQuantity = async (req, res) => {
    const {userId, productId} = req.body;
    console.log("Incoming Data:", req.body);

    try {
        const user = await User.findById(userId);
        console.log("User Found:", user);

        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        console.log("Cart Item Found:", cartItem);

        if (cartItem) {
            cartItem.quantity += 1;
            await user.save();
            res.status(200).json({success: true, cart: user.cart});
        } else {
            res.status(404).json({success: false, message: "Item not found in cart"});
        }
    } catch (err) {
        console.error("Error Occurred:", err);
        res.status(500).json({success: false, message: "Server Error"});
    }
};


const removeFromCart = async (req, res) => {
    const {userId, productId} = req.body;
    try {
        const user = await User.findById(userId);
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();
        res.status(200).json({success: true, cart: user.cart});
    } catch (err) {
        res.status(500).json({success: false, message: "Server Error"});
    }
};

const decreaseCartQuantity = async (req, res) => {
    const {userId, productId} = req.body;
    console.log(req.body);
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({success: false, message: "User not found"});

        const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
        if (cartItemIndex === -1) {
            return res.status(404).json({success: false, message: "Item not found in cart"});
        }

        const cartItem = user.cart[cartItemIndex];
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            user.cart.splice(cartItemIndex, 1);
        }

        await user.save();
        return res.status(200).json({success: true, cart: user.cart});

    } catch (err) {
        console.error("Error decreasing cart quantity:", err);
        return res.status(500).json({success: false, message: "Server Error"});
    }
};


module.exports = {increaseCartQuantity, removeFromCart, decreaseCartQuantity};
