import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };


    useEffect(()=> {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/product/getProducts", {withCredentials: true})
                console.log(res.data)
                const shuffledProducts = shuffleArray(res.data.data);
                setProducts(shuffledProducts);
            } catch (e) {
                console.log(e)
                alert("An error occurred")
            }
        }
        fetchProducts()
    },[])



    const navigate = useNavigate();

    const handleProduct = (id) => {
    // alert(id)
        navigate(`/product-info/${id}`);
    }

    return (
        <>
            <div className="flex justify-start flex-wrap">
                {products.map((product, index) => {
                    const originalPrice = product.price;
                    const discountPercent = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
                    const inflatedPrice = Math.round(originalPrice * (100 / (100 - discountPercent)));
                    return (
                        <div
                            key={index}
                            className="group border-b-2 border-black w-[18%] m-[1%] overflow-hidden cursor-pointer transition-all duration-300 "
                            onClick={() => {handleProduct(product._id)}}
                        >
                            <div className="h-48 w-full overflow-hidden flex items-center justify-center bg-white">
                                <img
                                    src={`https://ik.imagekit.io/0Shivams${product.images?.[0] || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png"}`}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";
                                    }}
                                    className="h-full object-contain transition-transform duration-300 transform hover:scale-105"
                                />
                            </div>


                            <div className="flex flex-col gap-1 p-2">
                                <h1 className="font-bold transition-colors duration-300 group-hover:underline">
                                    {product.name}
                                </h1>
                                <p>
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
                                <button className="text-center p-2 border-2 border-black rounded-lg hover:bg-gray-200">Add to Cart</button>
                            </div>
                        </div>
                    );
                })}
            </div>


        </>
    )
}

export default Products;