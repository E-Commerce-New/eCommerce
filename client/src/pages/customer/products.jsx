import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(()=> {
        const fetchProducts = async () => {
            try{
                const res = await axios.get("http://localhost:3000/api/product/getProducts",{withCredentials: true})
                console.log(res.data)
                setProducts(res.data.data);
            }catch(e){
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
                            className="group border-b-2 border-black w-[18%] m-[1%] overflow-hidden cursor-pointer transition-all duration-300"
                            onClick={() => {handleProduct(product._id)}}
                        >
                            <div className="overflow-hidden">
                                <img
                                    // src="https://www.shipbob.com/wp-content/uploads/2022/06/PRODUCT-RANGE.jpg"
                                    src={"https://ik.imagekit.io/0Shivams"+product.images?.[0]}
                                    alt={product.name}
                                    className="transition-transform duration-300 transform group-hover:scale-105"
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
                            </div>
                        </div>
                    );
                })}
            </div>


        </>
    )
}

export default Products;