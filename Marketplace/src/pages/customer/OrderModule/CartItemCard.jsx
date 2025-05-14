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

    return (<div className="border-b-2 p-4 border-black flex gap-2 justify-between">
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
                <div className="text-lg font-semibold flex gap-2 flex-col">
                    <p>{item?.name}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 w-full">
                        {!isOutOfStock && (<div
                                className="flex gap-4 items-center border-2 border-yellow-400 rounded-2xl py-1 px-3 w-full sm:w-auto text-sm">
                                {item?.quantity > 1 ? (<p
                                        onClick={() => user ? decreaseQuantity(user._id, item?._id, cartUpdated, setCartUpdated) : handleQuantityChange(item._id, "dec")}
                                        className="cursor-pointer basis-1/3 text-left text-lg sm:text-base"
                                    >
                                        -
                                    </p>) : (<p
                                        onClick={() => user ? deleteCartItem(user._id, item?._id, cartUpdated, setCartUpdated) : handleQuantityChange(item._id, "remove")}
                                        className="cursor-pointer basis-1/3 text-left"
                                    >
                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5"/>
                                    </p>)}
                                <p className="basis-1/3 text-center text-base">{item?.quantity}</p>
                                <p
                                    onClick={() => user ? increaseQuantity(user._id, item?._id, cartUpdated, setCartUpdated) : handleQuantityChange(item._id, "inc")}
                                    className="cursor-pointer basis-1/3 text-right text-lg sm:text-base"
                                >
                                    +
                                </p>
                            </div>)}

                        <div
                            className="flex items-center gap-1 text-sm sm:text-base text-red-600 hover:text-red-800 transition cursor-pointer"
                            onClick={() => user ? deleteCartItem(user._id, item?._id, cartUpdated, setCartUpdated) : handleQuantityChange(item._id, "remove")}
                        >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5"/>
                            <p>Delete</p>
                        </div>
                        <button
                            onClick={() => saveForLater(user._id, item._id, () => setCartUpdated(!cartUpdated))}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Save for Later
                        </button>
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
        </div>);
};

export default CartItemCard;
