import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

// This page is responsible to show the Save for later products and the following functions - Move to cart , delete from save to cart

const fallbackImg = "https://via.placeholder.com/80";

const SaveForLater = ({ user }) => {
    const [saveForLater, setSaveForLater] = useState([]);
    const [fetch , setFetch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getSaveForLater = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/saveForLater/get/${user._id}`);
                if (res.status === 200) {
                    setSaveForLater(res.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getSaveForLater();
    }, [user._id , fetch]);

    const handleMoveToCart = async (productId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/saveForLater/move-to-cart`, {
                userId: user._id,
                productId,
            });
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Item moved to cart!',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setFetch(!fetch)
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Error moving item to cart',
            });
        }
    };

    const handleDeleteFromSaveForLater = async (productId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/saveForLater/delete-save-for-later`, {
                userId: user._id,
                productId,
            });

            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Item removed from Save for Later!',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setFetch(!fetch)
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete item',
            });
        }
    };

    return (
        <div className="mt-8 border-t-2 pt-6">
            {saveForLater.length === 0 ? (
                <p className="text-2xl text-center text-gray-500 font-bold">
                    No items saved for later
                </p>
            ) : (
                <>
                    <h1 className="text-red-500 text-xl font-bold mb-6">Saved For Later</h1>

                    <div className="space-y-6">
                        {saveForLater.map((itemObj, index) => {
                            const item = itemObj.product;
                            const quantity = itemObj.quantity;
                            const originalPrice = item.price;
                            const inflatedPrice = Math.round(item.price * 1.25);
                            const discountPercent = Math.round(
                                ((inflatedPrice - originalPrice) / inflatedPrice) * 100
                            );

                            return (
                                <div
                                    key={item._id}
                                    className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-4"
                                >
                                    {/* 🖼️ Product Info */}
                                    <div
                                        className="flex gap-4 cursor-pointer"
                                        onClick={() => navigate(`/product-info/${item._id}`)}
                                    >
                                        <img
                                            src={`https://ik.imagekit.io/0Shivams${item?.images?.[0]}`}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded border"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = fallbackImg;
                                            }}
                                        />
                                        <div className="flex flex-col gap-1 max-w-md">
                                            <p className="font-semibold text-base">{item.name}</p>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {item.description}
                                            </p>
                                            <p className="text-gray-400 text-sm">Qty: {quantity}</p>
                                        </div>
                                    </div>

                                    {/* 💰 Price & Actions */}
                                    <div className="flex flex-col items-end justify-between text-sm">
                                        <div className="text-right">
                                            <p className="text-green-600 font-semibold text-lg">
                                                ₹{originalPrice}
                                            </p>
                                            <p className="text-red-500">{discountPercent}% OFF</p>
                                            <p className="line-through text-xs text-gray-500">
                                                M.R.P: ₹{inflatedPrice}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-1 mt-2">
                                            <button
                                                onClick={() => handleMoveToCart(item._id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Move to Cart
                                            </button>

                                            <button
                                                onClick={() => handleDeleteFromSaveForLater(item._id)}
                                                className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>

    );
};

export default SaveForLater;
