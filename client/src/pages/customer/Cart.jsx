import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {CircleX} from "lucide-react"
import swal from "sweetalert2";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {handlePayment} from "./OrderModule/handlePayment.js"
import {handleAddressClick} from "./OrderModule/handleAddressClick.js"
import ShowCartItems from "./OrderModule/ShowCartItems.jsx"

const Cart = () => {
    const {user} = useSelector((state) => state.user)
    console.log(user.addresses?.[0])
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    // const [shippingAddress, setShippingAddress] = useState({})
    const [userCart, setUserCart] = useState([]);
    const [afterAddCartClick, setAfterAddCartClick] = useState(false);
    const [cartUpdated, setCartUpdated] = useState(false);


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
    }, [user, cartUpdated]);

    const fallbackImg = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";

    let totalPrice = cartItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    // console.log("total Price", totalPrice)

    const handleProduct = (id) => {
        navigate(`/product-info/${id}`);
    }


    return (<div className="p-4 w-[70%] ml-[15%] h-[80vh] overflow-y-scroll scrollbar-hide
        border rounded-2xl bg-white
        shadow-2xl transform-gpu
        hover:scale-[1.02] hover:-rotate-x-1 hover:rotate-y-1
        transition-all duration-300 ease-in-out
        bg-white/30 backdrop-blur-md border-white/20"
    >

        {/*Let Select User the Addresses after clicking on buy now*/}
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
                    }}><CircleX/></span>
            <h1 className='text-center font-bold text-2xl bg-indigo-100 p-4'>Shipping Address</h1>
            {user?.addresses.map((address) => (<div key={address._id}
                                                    className="flex gap-2 p-4 border-b-2 border-black flex-col bg-indigo-200 hover:bg-indigo-400"
                                                    onClick={() => handleAddressClick({
                                                        address, cartItems, totalPrice, user, userCart, handlePayment,
                                                    })}>
                    <p>Address Line 1: {address.addressLine1}</p>
                    <p>Address Line 2: {address.addressLine2}</p>
                    <p>City: <span>{address.city}</span>, State: <span>{address.state}</span>,
                        Pincode: <span>{address.pinCode}</span></p>
                    <p>Country: {address.country}</p>
                </div>))}
        </div>


        {/*show Cart Items */}
        <ShowCartItems
            cartItems={cartItems}
            handleProduct={handleProduct}
            fallbackImg={fallbackImg}
            user={user}
            cartUpdated={cartUpdated}
            setCartUpdated={setCartUpdated}
            totalPrice={totalPrice}
            setAfterAddCartClick={setAfterAddCartClick}
        />

    </div>);
};

export default Cart;