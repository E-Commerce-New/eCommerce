import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
    const { user } = useSelector((state) => state.user);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartProducts = async () => {
            try {
                // Fetch the user's full data including cart
                const userRes = await axios.post("http://localhost:3000/api/user/getUser", {
                    id: user._id,
                });

                if (userRes.status === 200) {
                    const cart = userRes.data.data.cart;

                    // Fetch product details for each item in the cart
                    const productPromises = cart.map((item) =>
                        axios.post("http://localhost:3000/api/product/getProductById", {
                            id: item.productId,
                        })
                    );

                    const productResponses = await Promise.all(productPromises);
                    const products = productResponses.map((res, index) => ({
                        ...res.data.data,
                        quantity: cart[index].quantity,
                    }));

                    setCartItems(products);
                }
            } catch (err) {
                console.error("Error fetching cart products:", err);
            }
        };

        fetchCartProducts();
    }, [user._id]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-4 w-1/3">
                    {cartItems.map((item , index) => (
                        <div key={item._id} className="border-b-2 p-4 border-black">
                            <div className="text-lg font-semibold flex gap-2">
                                <p>{index+1}</p>
                                <p>{item.name}</p>
                            </div>


                            <p>Price: ₹{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cart;
