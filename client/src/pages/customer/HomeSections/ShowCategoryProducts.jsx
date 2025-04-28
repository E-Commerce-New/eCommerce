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
        <div className="category-products">
            <h1 className="text-center text-3xl font-bold mb-6">Products in this Category</h1>

            {/* Check if products are available */}
            {products.length === 0 ? (
                <p className="text-center text-xl text-gray-500">No products found</p>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    {products.map((product) => (
                        <div key={product._id} className=" bg-gray-200 p-4 rounded-lg text-center overflow-hidden"
                        onClick={() => navigate(`/product-info/${product._id}`)}
                        >
                            <img src={`https://ik.imagekit.io/0Shivams${product.images[0]}`} alt={product.name} className="w-full h-40 object-cover mb-2 hover:scale-105 transition-all"
                                 onError={(e) => {
                                     e.target.onerror = null;
                                     e.target.src = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";
                                 }}
                            />
                            <h2 className="text-xl">{product.name}</h2>
                            <p className="text-sm">{product.price} USD</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;
