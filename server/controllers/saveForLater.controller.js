const User = require("../models/user");

const saveForLater = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "Missing userId or productId" });
        }

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if already in Save for Later
        const alreadySaved = user.saveForLater.find((item) =>
            item.productId.toString() === productId
        );
        if (alreadySaved) {
            return res.status(200).json({ message: "Product already in Save for Later" });
        }

        // Remove from Cart if exists
        user.cart = user.cart.filter(
            (item) => item.productId.toString() !== productId
        );

        // Add to Save for Later
        user.saveForLater.push({ productId });

        await user.save();

        res.status(200).json({
            message: "Product moved to Save for Later",
            saveForLater: user.saveForLater,
            cart: user.cart,
        });
    } catch (err) {
        console.error("Save for Later Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getSaveForLaterItems = async (req, res) => {
    const { userId } = req.params
    console.log(userId)

    try {
        const user = await User.findById(userId).populate('saveForLater.productId');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const savedItems = user.saveForLater.map(item => {
            return {
                product: item.productId,
                quantity: item.quantity,
            };
        });

        res.status(200).json({ data: savedItems });
    } catch (err) {
        console.error('Error getting saved items:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const moveToCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // 1. Remove item from saveForLater
        const itemToMove = user.saveForLater.find(item => item.productId.toString() === productId);
        if (!itemToMove) return res.status(400).json({ message: "Item not found in Save For Later" });

        user.saveForLater = user.saveForLater.filter(item => item.productId.toString() !== productId);

        // 2. Add to cart or increment quantity
        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (cartItem) {
            cartItem.quantity += itemToMove.quantity;
        } else {
            user.cart.push({ productId, quantity: itemToMove.quantity });
        }

        await user.save();
        res.status(200).json({ success: true, message: "Item moved to cart successfully" });
    } catch (err) {
        console.error("Move to cart error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


const deleteFromSaveForLater = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const beforeLength = user.saveForLater.length;
        user.saveForLater = user.saveForLater.filter(item => item.productId.toString() !== productId);

        if (user.saveForLater.length === beforeLength) {
            return res.status(400).json({ message: "Item not found in Save For Later" });
        }

        await user.save();
        res.status(200).json({ success: true, message: "Item deleted from Save For Later" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { saveForLater , getSaveForLaterItems ,deleteFromSaveForLater , moveToCart }
