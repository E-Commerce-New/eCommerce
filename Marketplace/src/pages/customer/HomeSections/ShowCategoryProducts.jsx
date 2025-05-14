import { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';

const CategoryProducts = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/product/getProductsByCategory/${categoryId}`);
                const data = await response.json();
                setProducts(data.products);
                console.log(data.products[0])
            } catch (err) {
                console.error("Error fetching products", err);
            }
        };
        fetchProducts();
    }, [categoryId]);

    return (
        <div className="category-products px-4 sm:px-8 lg:px-16 py-10">
            <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
                Products in this Category
            </h1>

            {products.length === 0 ? (
                <p className="text-center text-xl text-gray-500">No products found</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 cursor-pointer"
                            onClick={() => navigate(`/product-info/${product._id}`)}
                        >
                            <div className="w-full h-48 overflow-hidden bg-gray-100">
                                <img
                                    src={`https://ik.imagekit.io/0Shivams${product.images[0]}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";
                                    }}
                                />
                            </div>

                            <div className="p-4 text-left">
                                <h2 className="text-lg font-semibold text-gray-800 truncate">
                                    {product.name}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">${product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
};

export default CategoryProducts;
