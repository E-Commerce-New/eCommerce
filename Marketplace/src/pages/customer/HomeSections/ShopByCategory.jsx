import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"; // For navigating between pages

const ShopByCategory = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/getCategories`);
                console.log(response.data.categories);
                setCategories(response.data.categories);
            } catch (err) {
                console.error("Error fetching categories", err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div>
            <h1 className="text-center text-3xl font-bold mb-6">Shop by Category</h1>
            <div className="grid grid-cols-5 text-nowrap gap-4">
                {categories?.map((category) => (
                    <div
                        key={category._id}
                        className="category-item bg-gray-200 py-2 px-4 rounded-lg text-center cursor-pointer hover:bg-gray-300"
                        onClick={() => navigate(`/category/${category._id}`)}
                    >
                        <h2 className="text-xl text-red-500 capitalize">{category.category}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopByCategory;
