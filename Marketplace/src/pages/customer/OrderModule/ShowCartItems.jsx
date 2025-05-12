import GoBack from "../../../components/reUsable/Goback.jsx";
import {decreaseQuantity, deleteCartItem, increaseQuantity} from "./QuantityHandler.js";
import {ShoppingBag, Trash2} from "lucide-react";
import {Link} from "react-router-dom";
import {handleAddressClick} from "./handleAddressClick.js";

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
                                            <div className="flex border-2 border-yellow-400 rounded-2xl py-1 px-3 w-[5vw] text-sm">
                                                {item?.quantity > 1 ? (
                                                    <p
                                                        onClick={() => decreaseQuantity(user._id, item?._id, cartUpdated, setCartUpdated)}
                                                        className="cursor-pointer basis-1/3 text-left"
                                                    >
                                                        -
                                                    </p>
                                                ) : (
                                                    <p
                                                        onClick={() => deleteCartItem(user._id, item?._id, cartUpdated, setCartUpdated)}
                                                        className="cursor-pointer basis-1/3"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-sm" />
                                                    </p>
                                                )}
                                                <p className="basis-1/3 text-center">{item?.quantity}</p>
                                                <p
                                                    onClick={() => increaseQuantity(user._id, item?._id, cartUpdated, setCartUpdated)}
                                                    className="cursor-pointer basis-1/3 text-right"
                                                >
                                                    +
                                                </p>
                                            </div>
                                            <div
                                                className="flex gap-1 text-sm items-center cursor-pointer"
                                                onClick={() => deleteCartItem(user._id, item?._id, cartUpdated, setCartUpdated)}
                                            >
                                                <Trash2 className="w-4 h-4 text-sm" /> <p>Delete</p>
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
