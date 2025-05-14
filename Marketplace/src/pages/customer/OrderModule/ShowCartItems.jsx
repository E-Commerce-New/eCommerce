import GoBack from "../../../components/reUsable/Goback.jsx";
import {deleteCartItem,} from "./QuantityHandler.js";
import {ShoppingBag, Trash2} from "lucide-react";
import {Link} from "react-router-dom";
import {handleAddressClick} from "./handleAddressClick.js";
import CartItemCard from "./CartItemCard";
import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ShowCartItems = ({
                           cartItems,
                           outOfStockItems,
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

    // This function is to handle the cart quantity while user is guest
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
                {cartItems.map((item, index) => (
                    <CartItemCard
                        key={item._id}
                        item={item}
                        index={index}
                        user={user}
                        cartUpdated={cartUpdated}
                        setCartUpdated={setCartUpdated}
                        handleProduct={handleProduct}
                        handleQuantityChange={handleQuantityChange}
                        deleteCartItem={deleteCartItem}
                        isOutOfStock={false}
                        fallbackImg={fallbackImg}
                    />
                ))}

                <div className="w-full text-right sticky -bottom-4 bg-white">
                    <p className="text-lg font-bold">
                        Total: ({cartItems.length} Items) ₹{totalPrice.toLocaleString()}
                    </p>
                    <button
                        onClick={() =>
                            showAddressPopup(user, handleAddressClick, cartItems, totalPrice, userCart, handlePayment)
                        }
                        className="px-4 py-2 border-2 rounded-xl border-black bg-green-200 font-medium mt-2 active:bg-gray-400"
                    >
                        <p className="flex gap-2">
                            <ShoppingBag /> Buy Your Cart
                        </p>
                    </button>
                </div>

                {outOfStockItems.length > 0 && (
                    <>
                        <h1 className="text-red-500 text-xl font-bold mt-6 mb-2">Out of Stock Products</h1>
                        {outOfStockItems.map((item, index) => (
                            <CartItemCard
                                key={item._id}
                                item={item}
                                index={index}
                                user={user}
                                cartUpdated={cartUpdated}
                                setCartUpdated={setCartUpdated}
                                handleProduct={handleProduct}
                                handleQuantityChange={handleQuantityChange}
                                deleteCartItem={deleteCartItem}
                                isOutOfStock={true}
                                fallbackImg={fallbackImg}
                            />
                        ))}
                    </>
                )}

            </div>
        )}
    </div>

);
};

export default ShowCartItems;
