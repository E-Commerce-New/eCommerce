import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import Swal from "sweetalert2";
import swal from "sweetalert2";
import addToCart from "../../components/reUsable/AddToCart.js";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const {user} = useSelector((state) => state.user);
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            Swal.fire({
                title: 'Loading...', allowOutsideClick: false, allowEscapeKey: false, didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/getActiveProducts`, {withCredentials: true})
                console.log(res.data)
                const shuffledProducts = shuffleArray(res.data.data);
                setProducts(shuffledProducts);
                swal.close()
            } catch (e) {
                swal.close()
                console.log(e)
                swal.fire({
                    icon: "error", title: "Oops...", text: "Something went wrong...",
                })
            }
        }
        fetchProducts()

    }, [])

    useEffect(() => {
        AOS.init({duration: 800, once: true});
    }, []);

    const navigate = useNavigate();

    const handleProduct = (id) => {
        navigate(`/product-info/${id}`);
    }

    const handleAddToCart = (productId, user) => {
        if (!user || !user._id) {
            let guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];

            const index = guestCart.findIndex((item) => item.productId === productId);
            if (index !== -1) {
                guestCart[index].quantity += 1;
            } else {
                guestCart.push({productId, quantity: 1});
            }

            localStorage.setItem('guest_cart', JSON.stringify(guestCart));

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'Saved temporarily in guest cart',
                text: 'Please login to save permanently',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });

            return;
        }

        // Logged-in users – call backend
        addToCart(productId, user._id);
    }


    return (<>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {products.map((product, index) => {
                const originalPrice = product.price;
                const discountPercent = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
                const inflatedPrice = Math.round(originalPrice * (100 / (100 - discountPercent)));

                return (
                    <div
                        key={index}
                        className="group border border-gray-300 rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        data-aos="fade-up"
                    >
                        <div
                            className="h-48 w-full flex items-center justify-center bg-white overflow-hidden"
                            onClick={() => handleProduct(product._id)}
                        >
                            <img
                                src={`https://ik.imagekit.io/0Shivams${product.images?.[0] || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png"}`}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";
                                }}
                                className="h-full object-contain transition-transform duration-300 transform group-hover:scale-105"
                            />
                        </div>

                        <div className="p-3 flex flex-col gap-2">
                            <h1
                                className="font-semibold text-sm sm:text-base group-hover:underline"
                                onClick={() => handleProduct(product._id)}
                            >
                                {product.name}
                            </h1>

                            <div
                                className="text-sm"
                                onClick={() => handleProduct(product._id)}
                            >
            <span className="line-through text-gray-500 mr-2">
              ₹{inflatedPrice?.toLocaleString()}
            </span>
                                <span className="text-green-600 font-semibold">
              ₹{originalPrice?.toLocaleString()}
            </span>
                            </div>

                            <span className="text-xs text-red-500 font-medium">
            {discountPercent}% OFF
          </span>

                            <button
                                className={`mt-auto text-sm text-white p-2 rounded-lg transition ${
                                    product.quantity < 1
                                        ? "bg-red-400 cursor-not-allowed"
                                        : "bg-black hover:bg-gray-800"
                                }`}
                                onClick={() => handleAddToCart(product._id, user)}
                                disabled={product.quantity < 1}
                            >
                                {product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>



    </>)
}

export default Products;