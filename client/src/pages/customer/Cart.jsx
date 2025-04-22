import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import {Trash2} from "lucide-react"
import swal from "sweetalert2";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

const Cart = () => {
    const { user } = useSelector((state) => state.user)
    console.log(user)
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }

        const fetchCartProducts = async () => {
            Swal.fire({
                title: 'Loading cart...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                const userRes = await axios.post("http://localhost:3000/api/user/getUser", {
                    id: user._id,
                });

                if (userRes.status === 200) {
                    const cart = userRes.data.data.cart;

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
            } finally {
                swal.close()
            }
        };

        fetchCartProducts();
    }, [user?._id]);

    const fallbackImg = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";

    const totalPrice = cartItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    const increaseQuantity = async (productId) => {
        Swal.fire({
            title: 'Increasing Product Quantity...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const res = await axios.put("http://localhost:3000/api/cart/increase", {
                userId: user._id,
                productId,
            });
            if (res.status === 200) {
                location.reload();
            }
        } catch (err) {
            console.error(err);
        } finally {
            swal.close();
        }
    };


    const deleteCartItem = async (productId) => {
        Swal.fire({
            title: 'Deleting Item...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const res = await axios.delete("http://localhost:3000/api/cart/delete", {
                data: {
                    userId: user._id,
                    productId,
                }
            });
            if (res.status === 200) {
                location.reload();
            }
        } catch (err) {
            console.error(err);
        } finally {
            swal.close();
        }
    };

    const decreaseQuanity = async (productId) => {
        Swal.fire({
            title: 'Decreasing Quantity...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const res = await axios.put("http://localhost:3000/api/cart/decrease", {
                    userId: user._id,
                    productId,
            });
            if (res.status === 200) {
                location.reload();
            }
        } catch (err) {
            console.error(err);
        } finally {
            swal.close();
        }
    };



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
                        // console.log(item)
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
                            <div className="text-lg font-semibold flex gap-2 flex-col">
                                <p >{item.name}</p>
                                <div className="flex border-2 border-yellow-400 rounded-2xl py-1 px-3 w-[5vw] text-sm">
                                    {item.quantity > 1 ?
                                    <p onClick={() => decreaseQuanity(item._id)} className="cursor-pointer basis-1/3 text-left">-</p>
                                        :
                                    <p onClick={() => deleteCartItem(item._id)} className="cursor-pointer basis-1/3"><Trash2 className="w-4 h-4 text-sm" />
                                    </p>
                                    }
                                    <p className="basis-1/3 text-center">{item.quantity}</p>
                                    <p onClick={() => increaseQuantity(item._id)} className="cursor-pointer basis-1/3 text-right">+</p>
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
                <div className="w-full text-right">
                    <p className="text-lg font-bold">Total: {"(" + cartItems.length + " " + "Items)"} ₹{totalPrice.toLocaleString()}</p>
                </div>
                </div>
            )}


        </div>
    );
};

export default Cart;
