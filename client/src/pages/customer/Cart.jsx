import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {ShoppingBag, Trash2} from "lucide-react"
import swal from "sweetalert2";
import Swal from "sweetalert2";
import {Link, useNavigate} from "react-router-dom";
import GoBack from "../../components/reUsable/Goback.jsx";

const Cart = () => {
    const {user} = useSelector((state) => state.user)
    console.log(user.addresses?.[0])
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const shippingAddress = user.addresses?.[0]
    const [userCart, setUserCart] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }

        const fetchCartProducts = async () => {
            Swal.fire({
                title: 'Loading cart...', allowOutsideClick: false, allowEscapeKey: false, didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                const userRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/getUser`, {
                    id: user._id,
                });

                if (userRes.status === 200) {
                    const cart = userRes.data.data.cart;
                    setUserCart(cart);
                    // console.log('Cart: ',cart)

                    const productPromises = cart.map((item) => axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/getProductById`, {
                        id: item.productId,
                    }));

                    const productResponses = await Promise.all(productPromises);
                    const products = productResponses.map((res, index) => ({
                        ...res.data.data, quantity: cart[index].quantity,
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
            title: 'Increasing Product Quantity...', allowOutsideClick: false, allowEscapeKey: false, didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/cart/increase`, {
                userId: user._id, productId,
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
            title: 'Deleting Item...', allowOutsideClick: false, allowEscapeKey: false, didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/cart/delete`, {
                data: {
                    userId: user._id, productId,
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
            title: 'Decreasing Quantity...', allowOutsideClick: false, allowEscapeKey: false, didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/cart/decrease`, {
                userId: user._id, productId,
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

    const handlePayment = async () => {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/create-order`, {amount: totalPrice});
        console.log("1st Api of Create Order", res)
        // console.log(res.data.order.amount / 100)

        const options = {
            key: 'rzp_test_YkO4VIe1rAjpOw',
            amount: res.data.order.amount,
            currency: 'INR',
            name: 'Ecommerce',
            description: 'Store For You!',
            order_id: res.data.order.id,
            handler: async function (response) {
                console.log(response);
                const verifyRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/verify`, {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: user._id,
                    amount: res.data.order.amount / 100,
                });
                console.log("2nd Verify Api", verifyRes);

                if (verifyRes.data.success) {
                    swal.fire({
                        title: 'Processing Your Order',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    try {
                        const placeRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/order/place`, {
                            cartItems, shippingAddress, paymentInfo: response, totalPrice, userId: user._id,
                        });
                        console.log("3rd Save data Api", placeRes);

                        if (placeRes.data.success) {
                            swal.close()
                            swal.fire("Success!", "Your order has been placed", "success").then((result) => {
                                if (result.isConfirmed) {
                                    location.reload();
                                }
                            })
                        }
                    } catch (e) {
                        swal.close()
                        swal.fire({
                            title: 'Error!',
                            icon: 'error',
                            text: e.response?.data?.message || "Something went wrong",
                        })
                    }
                } else {
                    swal.fire("Failed", "Payment verification failed", "error");
                }

            },
            prefill: {
                name: user?.firstname + ' ' + user?.lastname, email: user?.email, contact: user.phone,
            },
            theme: {
                color: '#3399cc',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handleProduct = (id) => {
        navigate(`/product-info/${id}`);
    }


    return (

        <div className="p-4 w-[70%] ml-[15%] h-[80vh] overflow-y-scroll scrollbar-hide
        border rounded-2xl bg-white
        shadow-2xl transform-gpu
        hover:scale-[1.02] hover:-rotate-x-1 hover:rotate-y-1
        transition-all duration-300 ease-in-out
        bg-white/30 backdrop-blur-md border-white/20"
        >
            <h1 className="text-xl font-bold sticky -top-5 bg-white p-2 flex gap-2 items-center"><GoBack/> Your Cart
            </h1>
            {cartItems.length === 0 ? (
                <div className="text-center p-4 text-red-500 font-medium"><Link to="/" className="text-2xl">Your cart is
                    empty. <br/> Shop Now</Link></div>) : (<div className=" w-full ">
                {cartItems.map((item, index) => {
                    const originalPrice = item?.price;
                    const discountPercent = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
                    const inflatedPrice = Math.round(originalPrice * (100 / (100 - discountPercent)));
                    // console.log(item)
                    return (<div key={item._id} className="border-b-2 p-4 border-black flex gap-2 justify-between">
                        <div className="flex gap-2">
                            <p>{index + 1}</p>
                            <img
                                onClick={() => handleProduct(item._id)}
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
                                    <p>{item.name}</p>
                                    <div
                                        className="flex border-2 border-yellow-400 rounded-2xl py-1 px-3 w-[5vw] text-sm">
                                        {item.quantity > 1 ? <p onClick={() => decreaseQuanity(item._id)}
                                                                className="cursor-pointer basis-1/3 text-left">-</p> :
                                            <p onClick={() => deleteCartItem(item._id)}
                                               className="cursor-pointer basis-1/3"><Trash2
                                                className="w-4 h-4 text-sm"/>
                                            </p>}
                                        <p className="basis-1/3 text-center">{item.quantity}</p>
                                        <p onClick={() => increaseQuantity(item._id)}
                                           className="cursor-pointer basis-1/3 text-right">+</p>
                                    </div>
                                    <div className="flex gap-1 text-sm items-center cursor-pointer"
                                         onClick={() => deleteCartItem(item._id)}>
                                        <Trash2 className="w-4 h-4 text-sm"/> <p>Delete</p>
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
                    </div>)
                })}
                <div className="w-full text-right sticky -bottom-4 bg-white">
                    <p className="text-lg font-bold">Total: {"(" + cartItems.length + " " + "Items)"} ₹{totalPrice.toLocaleString()}</p>
                    <button onClick={() => handlePayment()}
                            className="px-4 py-2 border-2 rounded-xl border-black bg-green-200 font-medium mt-2 active:bg-gray-400">
                        <p className="flex gap-2">
                            <ShoppingBag/> Buy Your Cart
                        </p>
                    </button>
                </div>
            </div>)}


        </div>);
};

export default Cart;
