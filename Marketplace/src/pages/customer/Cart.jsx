import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {useNavigate} from "react-router-dom";
import ShowCartItems from "./OrderModule/ShowCartItems.jsx";
import {handlePayment} from "./OrderModule/handlePayment.js";
import {handleAddressClick} from "./OrderModule/handleAddressClick.js";
import SaveForLater from "./OrderModule/SaveForLater.jsx"

const MySwal = withReactContent(Swal);

const Cart = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [userCart, setUserCart] = useState([]);
    const [cartUpdated, setCartUpdated] = useState(false);
    const [outOfStockItems, setOutOfStockItems] = useState([]);

    useEffect(() => {
        if (user?.isAdmin) navigate("/admin/panel");
    }, []);

    useEffect(() => {
        const getProductsById = async (item) => {
            console.log("Requesting product for ID:", item);
            try {
                if (user && user._id) {
                return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/getProductById`, {
                    id: item,
                });
                } else {
                return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/getProductById`, {
                    id: item.productId,
                });
                }
            } catch (e) {
                console.log(e, item);
            }
        };

        const fetchCartProducts = async () => {
            MySwal.fire({
                title: "Loading cart...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            try {
                const localCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

                if (user && user._id) {
                    const userRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/getUser`, { id: user._id });

                    if (userRes.status === 200) {
                        const cart = userRes.data.data.cart;
                        setUserCart(cart);

                        const outOfStockProducts = [];
                        const validProducts = [];

                        // Fetch product details for DB cart
                        const productRequests = cart.map(item => getProductsById(item.productId));
                        const productResponses = await Promise.all(productRequests);

                        productResponses.forEach((res, idx) => {
                            const product = res.data.data;
                            const quantityInCart = cart[idx].quantity;

                            if (product.quantity > 0) {
                                validProducts.push({
                                    ...product,
                                    quantity: quantityInCart
                                });
                            } else {
                                outOfStockProducts.push({
                                    ...product,
                                    quantity: 0
                                });
                            }
                        });

                        setCartItems(validProducts);
                        setOutOfStockItems(outOfStockProducts);
                    }
                } else {
                    // Guest user: fetch from localStorage
                    console.table(localCart);
                    const productRequests = localCart.map((item) => getProductsById(item));
                    const productResponses = await Promise.all(productRequests);
                    const products = productResponses.map((res, idx) => ({
                        ...res.data.data,
                        quantity: localCart[idx].quantity,
                    }));
                    setCartItems(products);
                }
            } catch (err) {
                console.error("Error fetching cart:", err);
            } finally {
                Swal.close();
            }
        };




        fetchCartProducts();
    }, [user, cartUpdated]);

    const fallbackImg = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleProduct = (id) => navigate(`/product-info/${id}`);

    const showAddressPopup = () => {
        if (!user) {
            return Swal.fire({
                icon: "info",
                title: "Login Required",
                text: "Please login to proceed with checkout.",
                confirmButtonText: "Go to Login",
                confirmButtonColor: "#000",
            }).then(() => navigate("/login"));
        }

        MySwal.fire({
            title: <p className="text-xl font-bold">Select Shipping Address</p>,
            html: (
                <div className="max-h-[60vh] overflow-y-scroll scrollbar-hide px-4 text-left">
                    {user?.addresses?.map((address) => (
                        <div
                            key={address._id}
                            className="p-4 my-2 bg-white hover:bg-gray-200 rounded-lg cursor-pointer"
                            onClick={() => {
                                handleAddressClick({
                                    address,
                                    cartItems,
                                    totalPrice,
                                    user,
                                    userCart,
                                    handlePayment,
                                });
                                Swal.close();
                            }}
                        >
                            <p><strong>Address Line 1:</strong> {address.addressLine1}</p>
                            <p><strong>Address Line 2:</strong> {address.addressLine2}</p>
                            <p>
                                <strong>City:</strong> {address.city}, <strong>State:</strong> {address.state}, <strong>Pincode:</strong> {address.postalCode}
                            </p>
                            <p><strong>Country:</strong> {address.country}</p>
                        </div>
                    ))}
                </div>
            ),
            showConfirmButton: false,
            showCloseButton: true,
            customClass: {
                popup: "rounded-2xl bg-white/90 backdrop-blur-lg shadow-2xl w-[80%] max-w-3xl",
            },
        });
    };



    return (
        <div className="p-4 mx-auto min-h-[90vh]">
            <ShowCartItems
                cartItems={cartItems}
                outOfStockItems={outOfStockItems}
                handleProduct={handleProduct}
                fallbackImg={fallbackImg}
                user={user}
                cartUpdated={cartUpdated}
                setCartUpdated={setCartUpdated}
                totalPrice={totalPrice}
                showAddressPopup={showAddressPopup}
            />
            {user && (
            <SaveForLater
            user={user}
            />
            )}
        </div>
    );
};

export default Cart;
