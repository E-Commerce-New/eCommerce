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
            <div className="flex flex-wrap gap-2 p-2">
                {categories?.map((category) => (
                    <div
                        key={category._id}
                        className="bg-gray-200 py-2 px-4 rounded-lg text-center cursor-pointer hover:bg-gray-300 capitalize"
                        onClick={() => navigate(`/category/${category._id}`)}
                    >
                        <h2 className="text-smcapitalize">{category.category} ({category.productCount})</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopByCategory;
