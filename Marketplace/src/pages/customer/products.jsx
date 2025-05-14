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
            <div className="flex justify-start flex-wrap">
                {products.map((product, index) => {
                    const originalPrice = product.price;
                    const discountPercent = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
                    const inflatedPrice = Math.round(originalPrice * (100 / (100 - discountPercent)));
                    return (<div
                            key={index}
                            className="group border-b-2 border-black w-[18%] m-[1%] overflow-hidden cursor-pointer transition-all duration-300"
                            data-aos="fade-up"
                        >
                            <div className="h-48 w-full overflow-hidden flex items-center justify-center bg-white"
                                 onClick={() => {
                                     handleProduct(product._id)
                                 }}
                            >
                                <>
                                    <img
                                        src={`https://ik.imagekit.io/0Shivams${product.images?.[0] || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png"}`}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";
                                        }}
                                        className="h-full object-contain transition-transform duration-300 transform hover:scale-105"
                                    /></>
                            </div>


                            <div className="flex flex-col gap-1 p-2">
                                <h1 className="font-bold transition-colors duration-300 group-hover:underline"
                                    onClick={() => {
                                        handleProduct(product._id)
                                    }}
                                >
                                    {product.name}
                                </h1>
                                <p
                                    onClick={() => {
                                        handleProduct(product._id)
                                    }}
                                >
                                        <span className="line-through text-gray-500 mr-2">
                                            ₹{inflatedPrice?.toLocaleString()}
                                        </span>
                                    <span className="text-green-600 font-semibold">
                                                 ₹{originalPrice?.toLocaleString()}
                                        </span>
                                </p>
                                <span className="text-sm text-red-500 font-medium">
                                            {discountPercent}% OFF
                                        </span>
                                <button
                                    className={`text-center p-2 border-2 border-black rounded-lg hover:bg-gray-200 ${product.quantity < 1 ? "cursor-not-allowed bg-red-200" : null}`}
                                    onClick={() => handleAddToCart(product._id, user)}
                                    disabled={product.quantity < 1}

                                >
                                    {product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
                                </button>
                            </div>
                        </div>);
                })}
            </div>


        </>)
}

export default Products;