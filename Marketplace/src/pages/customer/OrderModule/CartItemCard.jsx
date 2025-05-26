import {Trash2} from "lucide-react"
import {decreaseQuantity, increaseQuantity} from "./QuantityHandler.js";
import axios from "axios";
import Swal from "sweetalert2";

const CartItemCard = ({
                          item,
                          index,
                          isOutOfStock,
                          user,
                          cartUpdated,
                          setCartUpdated,
                          handleProduct,
                          handleQuantityChange,
                          deleteCartItem,
                          fallbackImg,
                      }) => {
    console.log({
        item,
        index,
        isOutOfStock,
        user,
        cartUpdated,
        setCartUpdated,
        handleProduct,
        handleQuantityChange,
        deleteCartItem,
        fallbackImg,
    })
    const originalPrice = item?.price;
    const discountPercent = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
    const inflatedPrice = Math.round(originalPrice * (100 / (100 - discountPercent)));

    const saveForLater = async (userId, productId, onSuccess) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/saveForLater/saveForLater`, {
                userId, productId,
            });

            if (res.status === 200) {
                Swal.fire({
                    icon: "success", title: "Moved to Save for Later",
                });
                if (onSuccess) onSuccess(res.data);

            } else {
                Swal.fire({
                    icon: "error", title: res.data.message || "Error saving product",
                });
            }
        } catch (err) {
            console.error("Save for Later Error:", err);
            Swal.fire({
                icon: "error", title: "Server error saving product",
            });
        }
    }

    return (<div className="border-b p-4 border-black flex flex-col sm:flex-row sm:justify-between gap-4">
            {/* Left Side: Image & Info */}
            <div className="flex gap-4 w-full sm:w-2/3">
                {/* Index & Image */}
                <div className="flex-shrink-0 flex flex-col items-center">
                    <p className="text-gray-500">{index + 1}</p>
                    <img
                        onClick={() => handleProduct(item?._id)}
                        src={`https://ik.imagekit.io/0Shivams${item?.images?.[0]}`}
                        alt={`Product ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md border cursor-pointer"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = fallbackImg;
                        }}
                    />
                </div>

                {/* Product Info + Actions */}
                <div className="flex flex-col justify-between w-full">
                    <p className="text-lg font-semibold">{item?.name}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                        {/* Quantity Controls */}
                        {!isOutOfStock && (
                            <div className="flex items-center gap-4 border border-yellow-400 rounded-2xl px-3 py-1 w-fit text-sm">
                                {/* Decrease or Delete */}
                                {item?.quantity > 1 ? (
                                    <button
                                        onClick={() =>
                                            user
                                                ? decreaseQuantity(user._id, item?._id, cartUpdated, setCartUpdated)
                                                : handleQuantityChange(item._id, "dec")
                                        }
                                        className="text-lg font-semibold"
                                    >
                                        -
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            user
                                                ? deleteCartItem(user._id, item?._id, cartUpdated, setCartUpdated)
                                                : handleQuantityChange(item._id, "remove")
                                        }
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}

                                {/* Quantity Display */}
                                <span className="text-base w-5 text-center">{item?.quantity}</span>

                                {/* Increase */}
                                <button
                                    onClick={() =>
                                        user
                                            ? increaseQuantity(user._id, item?._id, cartUpdated, setCartUpdated)
                                            : handleQuantityChange(item._id, "inc")
                                    }
                                    className="text-lg font-semibold"
                                >
                                    +
                                </button>
                            </div>
                        )}

                        {/* Delete Option */}
                        <div
                            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 cursor-pointer"
                            onClick={() =>
                                user
                                    ? deleteCartItem(user._id, item?._id, cartUpdated, setCartUpdated)
                                    : handleQuantityChange(item._id, "remove")
                            }
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                        </div>

                        {/* Save for Later */}
                        <button
                            onClick={() => saveForLater(user._id, item._id, () => setCartUpdated(!cartUpdated))}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Save for Later
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side: Price */}
            <div className="flex flex-col items-end justify-center sm:w-1/3">
                <p className="flex gap-2 items-center text-green-700 font-semibold">
                    <span className="text-sm text-red-500 font-medium">{discountPercent}%</span>
                    ₹{originalPrice}
                </p>
                <p className="text-sm text-gray-500">
                    M.R.P: <span className="line-through">{inflatedPrice}</span>
                </p>
            </div>
        </div>
    );
};

export default CartItemCard;
