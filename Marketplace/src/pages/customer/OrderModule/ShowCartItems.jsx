import GoBack from "../../../components/reUsable/Goback.jsx";
import {decreaseQuantity, deleteCartItem, increaseQuantity} from "./QuantityHandler.js";
import {ShoppingBag, Trash2} from "lucide-react";
import {Link} from "react-router-dom";
import {handleAddressClick} from "./handleAddressClick.js";
import axios from "axios";

const ShowCartItems = ({
                           cartItems,
                           handleProduct,
                           fallbackImg,
                           user,
                           cartUpdated,
                           setCartUpdated,
                           totalPrice,
                           showAddressPopup,
                           userCart,
                           handlePayment,
                       }) => {

    const handleQuantityChange = (productId, type) => {
        if (!user || !user._id) {
            let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
            const index = guestCart.findIndex(item => item.productId === productId);

            if (index !== -1) {
                if (type === "inc") {
                    guestCart[index].quantity += 1;
                } else if (type === "dec") {
                    guestCart[index].quantity -= 1;
                    if (guestCart[index].quantity <= 0) {
                        guestCart.splice(index, 1);
                    }
                } else if (type === "remove") {
                    guestCart.splice(index, 1);
                }
                localStorage.setItem("guest_cart", JSON.stringify(guestCart));
                setCartUpdated(prev => !prev);
            }
        } else {
            console.log("Failed")
        }
    };


    return (
        <div>
            <h1 className="text-xl font-bold sticky -top-5 bg-white p-2 flex gap-2 items-center">
                <GoBack /> Your Cart
            </h1>
            {cartItems.length === 0 ? (
                <div className="text-center p-4 text-red-500 font-medium">
                    <Link to="/" className="text-2xl">
                        Your cart is empty. <br /> Shop Now
                    </Link>
                </div>
            ) : (
                <div className="w-full">
                    {cartItems.map((item, index) => {
                        const originalPrice = item?.price;
                        const discountPercent = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
                        const inflatedPrice = Math.round(originalPrice * (100 / (100 - discountPercent)));
                        return (
                            <div key={item?._id} className="border-b-2 p-4 border-black flex gap-2 justify-between">
                                <div className="flex gap-2">
                                    <p>{index + 1}</p>
                                    <img
                                        onClick={() => handleProduct(item?._id)}
                                        src={`https://ik.imagekit.io/0Shivams${item?.images?.[0]}`}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-20 h-20 object-cover border-2 rounded-md cursor-pointer"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = fallbackImg;
                                        }}
                                    />
                                    <div>
                                        <div className="text-lg font-semibold flex gap-2 flex-col">
                                            <p>{item?.name}</p>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 w-full">
                                                {/* Quantity Controller */}
                                                <div className="flex gap-4 items-center border-2 border-yellow-400 rounded-2xl py-1 px-3 w-full sm:w-auto text-sm">
                                                    {item?.quantity > 1 ? (
                                                        <p
                                                            onClick={() => user ? decreaseQuantity(user._id, item?._id, cartUpdated, setCartUpdated) : handleQuantityChange(item._id , "dec")}
                                                            className="cursor-pointer basis-1/3 text-left text-lg sm:text-base"
                                                        >
                                                            -
                                                        </p>
                                                    ) : (
                                                        <p
                                                            onClick={() => user ? deleteCartItem(user._id, item?._id, cartUpdated, setCartUpdated) : handleQuantityChange(item._id , "remove")}
                                                            className="cursor-pointer basis-1/3 text-left"
                                                        >
                                                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </p>
                                                    )}
                                                    <p className="basis-1/3 text-center text-base">{item?.quantity}</p>
                                                    <p
                                                        onClick={() => user ? increaseQuantity(user._id, item?._id, cartUpdated, setCartUpdated) : handleQuantityChange(item._id , "inc")}
                                                        className="cursor-pointer basis-1/3 text-right text-lg sm:text-base"
                                                    >
                                                        +
                                                    </p>
                                                </div>

                                                {/* Delete Button */}
                                                <div
                                                    className="flex items-center gap-1 text-sm sm:text-base text-red-600 hover:text-red-800 transition cursor-pointer"
                                                    onClick={() => user ? deleteCartItem(user._id, item?._id, cartUpdated, setCartUpdated) : handleQuantityChange(item._id , "remove")}
                                                >
                                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <p>Delete</p>
                                                </div>
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
                                        M.R.P : <p className="line-through text-gray-500 mr-2">{inflatedPrice}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="w-full text-right sticky -bottom-4 bg-white">
                        <p className="text-lg font-bold">
                            Total: ({cartItems.length} Items) ₹{totalPrice.toLocaleString()}
                        </p>
                        <button
                            onClick={() => showAddressPopup(user, handleAddressClick, cartItems, totalPrice, userCart, handlePayment)}
                            className="px-4 py-2 border-2 rounded-xl border-black bg-green-200 font-medium mt-2 active:bg-gray-400"
                        >
                            <p className="flex gap-2">
                                <ShoppingBag /> Buy Your Cart
                            </p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowCartItems;
