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
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Header */}
            <h1 className="text-xl sm:text-2xl font-bold sticky top-0 bg-white z-10 py-3 border-b flex items-center gap-2">
                <GoBack /> Your Cart
            </h1>

            {/* Empty Cart */}
            {cartItems.length === 0 ? (
                <div className="text-center py-16 text-red-500 font-medium">
                    <Link to="/" className="text-2xl hover:underline">
                        Your cart is empty. <br /> <span className="text-blue-600">Shop Now</span>
                    </Link>
                </div>
            ) : (
                <div className="w-full space-y-6">
                    {/* Cart Items */}
                    <div className="space-y-4">
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
                    </div>

                    {/* Cart Summary */}
                    <div className="w-full text-right sticky bottom-0 bg-white border-t pt-4 pb-6 z-10">
                        <p className="text-lg sm:text-xl font-bold">
                            Total ({cartItems.length} item{cartItems.length > 1 ? "s" : ""}): ₹
                            {totalPrice.toLocaleString()}
                        </p>
                        <button
                            onClick={() =>
                                showAddressPopup(
                                    user,
                                    handleAddressClick,
                                    cartItems,
                                    totalPrice,
                                    userCart,
                                    handlePayment
                                )
                            }
                            className="mt-3 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <ShoppingBag size={18} /> Buy Your Cart
                            </div>
                        </button>
                    </div>

                    {/* Out-of-Stock Items */}
                    {outOfStockItems.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-xl text-red-600 font-bold mb-4">Out of Stock Products</h2>
                            <div className="space-y-4">
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
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>


    );
};

export default ShowCartItems;
