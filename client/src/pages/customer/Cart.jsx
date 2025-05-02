import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {CircleX, ShoppingBag, Trash2, IndianRupee} from "lucide-react"
import swal from "sweetalert2";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import GoBack from "../../components/reUsable/Goback.jsx";
import {Link} from "react-router-dom"

const Cart = () => {
    const {user} = useSelector((state) => state.user)
    console.log(user.addresses?.[0])
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    // const [shippingAddress, setShippingAddress] = useState({})
    const [userCart, setUserCart] = useState([]);
    const [afterAddCartClick, setAfterAddCartClick] = useState(false);


    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user?.isAdmin) {
            navigate('/admin/panel');
        }
    }, []);

    useEffect(() => {

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

                    const productPromises = cart.map((item) => axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/getProductById`, {
                        id: item?.productId,
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

    let totalPrice = cartItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    // console.log("total Price", totalPrice)
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

    const handlePayment = async (shippingAddress, paymentMethod, totalPrice, deliveryCharge, estimateDays) => {
        // console.log("Payment Method", totalPrice, paymentMethod, shippingAddress, deliveryCharge, estimateDays)
        if (paymentMethod === "Prepaid") {
            console.log("Online Payment")
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/create-order`, {amount: totalPrice});
            //console.log("1st Api of CreateProducts Order" , res)
            console.log(res.data)

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
                                // cartItems, shippingAddress, paymentInfo: response, totalPrice, userId: user._id,
                                cartItems,
                                shippingAddress,
                                totalPrice,
                                userId: user._id,
                                userCart,
                                paymentMethod,
                                deliveryCharge,
                                estimateDays
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
        } else {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/order/place`,
                {
                    cartItems,
                    shippingAddress,
                    totalPrice,
                    userId: user._id,
                    userCart,
                    paymentMethod,
                    deliveryCharge,
                    estimateDays
                }
            );
        }

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
            <div className={`
            fixed top-1/2 left-1/2 z-50
            transform -translate-x-1/2 -translate-y-1/2
            
            w-[70%] h-[80vh] overflow-y-scroll scrollbar-hide
            border rounded-2xl bg-white/90 backdrop-blur-lg border-white/20
            shadow-2xl transition-all duration-500 ease-out 
            ${afterAddCartClick ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"}
                `}>
                <span
                    className='absolute top-[10px] right-[10px] rounded-full p-2 bg-red-500 text-white hover:cursor-pointer'
                    onClick={() => {
                        setAfterAddCartClick(false);
                    }
                    }><CircleX/></span>
                <h1 className='text-center font-bold text-2xl bg-indigo-100 p-4'>Shipping Address</h1>
                {user?.addresses.map((address) => (
                    <div key={address._id}
                         className="flex gap-2 p-4 border-b-2 border-black flex-col bg-indigo-200 hover:bg-indigo-400"
                         onClick={async () => {
                             const weight = cartItems.map((item) => item.weight * item.quantity);
                             const pinCodeCharge = await Promise.all(
                                 weight.map(weight =>
                                     axios.get(`${import.meta.env.VITE_BASE_URL}/api/order/getCharges/${address.postalCode}/${weight}`)
                                 )
                             );
                             const deliveryCharges = pinCodeCharge.map(item => item?.data?.finalResult[0]?.freight_charge);
                             const estimatedDays = pinCodeCharge.map(item => item?.data?.finalResult[0]?.estimated_delivery_days);
                             Swal.fire({
                                 title: "Order Summary",
                                 text: `Delivery Charges ₹
                                 ${
                                     deliveryCharges.join(', ')
                                 }
                                     and Estimated Days of Delivery 
                                 ${
                                     estimatedDays
                                 }
                                 `,
                                 icon: 'info',
                                 showCancelButton: true,
                                 confirmButtonColor: 'green',
                                 cancelButtonColor: '#3085d6',
                                 confirmButtonText: 'Proceed',
                                 cancelButtonText: 'Cancel',
                             }).then((result1) => {
                                 if (result1.isConfirmed) {
                                     Swal.fire({
                                         title: 'Choose a Payment Method',
                                         // text: "Want to cancel this order?",
                                         icon: 'info',
                                         allowOutsideClick: true,
                                         allowEscapeKey: true,
                                         showCancelButton: true,
                                         confirmButtonColor: 'green',
                                         cancelButtonColor: '#3085d6',
                                         confirmButtonText: 'Cash On Delivery',
                                         cancelButtonText: 'Online',
                                     }).then((result) => {
                                         if (result.isConfirmed) {
                                             // console.log('Cash On Delivery!');
                                             handlePayment(address, "COD", Math.ceil(totalPrice + deliveryCharges.reduce((acc, item) => {
                                                 return acc + item;
                                             }, 0)), deliveryCharges, estimatedDays);
                                         } else if (result.isDismissed) {
                                             // console.log('Online!');
                                             handlePayment(address, "Prepaid", Math.ceil(totalPrice + deliveryCharges.reduce((acc, item) => {
                                                     return acc + item;
                                                 }, 0)), deliveryCharges, estimatedDays
                                             );
                                         }
                                     })
                                 }
                             })
                         }}
                    >
                        <p>Address Line 1: {address.addressLine1}</p>
                        <p>Address Line 2: {address.addressLine2}</p>
                        <p>City: <span>{address.city}</span>, State: <span>{address.state}</span>,
                            Pincode: <span>{address.pinCode}</span></p>
                        <p>Country: {address.country}</p>
                    </div>
                ))}
            </div>
            <h1 className="text-xl font-bold sticky -top-5 bg-white p-2 flex gap-2 items-center"><GoBack/> Your Cart
            </h1>
            {
                cartItems.length === 0 ? (
                    <div className="text-center p-4 text-red-500 font-medium"><Link to="/" className="text-2xl">Your
                        cart is
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
                        <button onClick={() => setAfterAddCartClick(true)}
                                className="px-4 py-2 border-2 rounded-xl border-black bg-green-200 font-medium mt-2 active:bg-gray-400">
                            <p className="flex gap-2">
                                <ShoppingBag/> Buy Your Cart
                            </p>
                        </button>
                    </div>
                </div>)
            }
        </div>)
        ;
};

export default Cart;