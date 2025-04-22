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

    const fallbackImg = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";

    const totalPrice = cartItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);


    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-4 w-2/3 ">
                    {cartItems.map((item , index) => {
                        const originalPrice = item?.price;
                        const discountPercent = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
                        const inflatedPrice = Math.round(originalPrice * (100 / (100 - discountPercent)));



                        return (
                        <div key={item._id} className="border-b-2 p-4 border-black flex gap-2 justify-between">
                            <div className="flex gap-2">
                            <p>{index+1}</p>
                                <img
                                    key={index}
                                    src={`https://ik.imagekit.io/0Shivams${item?.images?.[0]}`}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-20 h-20 object-cover border-2 rounded-md cursor-pointer`}

                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = fallbackImg;
                                    }}
                                />
                            <div>
                            <div className="text-lg font-semibold flex gap-2">
                                <p >{item.name}</p>
                                <div>

                                </div>
                            </div>
                            </div>
                            </div>
                            <div className="flex flex-col items-end justify-center">
                                <p className="flex gap-3 items-center">
                                    <span className="text-sm text-red-500 font-medium">{discountPercent}%</span>
                                    <span className="text-green-600 font-semibold">₹{originalPrice}</span>
                                </p>
                                <div className="flex gap-2">
                                M.R.P : <p className="line-through text-gray-500 mr-2" >{inflatedPrice}</p>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            )}

            <div className="mt-6 w-full text-right border-t-2 border-black pt-4">
                <p className="text-lg font-bold">Total: ₹{totalPrice.toLocaleString()}</p>
            </div>

        </div>
    );
};

export default Cart;
