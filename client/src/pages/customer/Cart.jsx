import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import ShowCartItems from "./OrderModule/ShowCartItems.jsx";
import { handlePayment } from "./OrderModule/handlePayment.js";
import { handleAddressClick } from "./OrderModule/handleAddressClick.js";
const MySwal = withReactContent(Swal);

const Cart = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [userCart, setUserCart] = useState([]);
    const [cartUpdated, setCartUpdated] = useState(false);

    useEffect(() => {
        if (!user) navigate("/login");
        else if (user?.isAdmin) navigate("/admin/panel");
    }, []);

    useEffect(() => {
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
                const userRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/getUser`, { id: user._id });

                if (userRes.status === 200) {
                    const cart = userRes.data.data.cart;
                    setUserCart(cart);

                    const productRequests = cart.map((item) =>
                        axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/getProductById`, {
                            id: item.productId,
                        })
                    );

                    const productResponses = await Promise.all(productRequests);
                    const products = productResponses.map((res, idx) => ({
                        ...res.data.data,
                        quantity: cart[idx].quantity,
                    }));

                    setCartItems(products);
                }
            } catch (err) {
                console.error("Error fetching cart:", err);
            } finally {
                Swal.close();
            }
        };

        if (user) fetchCartProducts();
    }, [user, cartUpdated]);

    const fallbackImg = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleProduct = (id) => navigate(`/product-info/${id}`);

    const showAddressPopup = () => {
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
                            <p><strong>City:</strong> {address.city}, <strong>State:</strong> {address.state}, <strong>Pincode:</strong> {address.postalCode}</p>
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
        <div className="p-4 w-[70%] ml-[15%] h-[80vh] overflow-y-scroll scrollbar-hide border rounded-2xl bg-white shadow-2xl transform-gpu hover:scale-[1.02] hover:-rotate-x-1 hover:rotate-y-1 transition-all duration-300 ease-in-out bg-white/30 backdrop-blur-md border-white/20">
            <ShowCartItems
                cartItems={cartItems}
                handleProduct={handleProduct}
                fallbackImg={fallbackImg}
                user={user}
                cartUpdated={cartUpdated}
                setCartUpdated={setCartUpdated}
                totalPrice={totalPrice}
                showAddressPopup={showAddressPopup}
            />
        </div>
    );
};

export default Cart;
