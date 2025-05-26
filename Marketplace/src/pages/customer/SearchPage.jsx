import { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState("newest");
    const [filters, setFilters] = useState({
        keyword: new URLSearchParams(location.search).get("query") || "",
        category: "",
        minPrice: "",
        maxPrice: "",
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/search`, {
                ...filters,
                sortBy,
            });
            setProducts(response.data.products);
        } catch (err) {
            console.error("Error fetching search results", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters, sortBy]);

    const handleInputChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSortClick = async () => {
        const { value: selectedSort } = await Swal.fire({
            title: 'Select Sorting Option',
            input: 'select',
            inputOptions: {
                newest: 'Newest',
                oldest: 'Oldest',
                price_low_high: 'Price: Low to High',
                price_high_low: 'Price: High to Low',
            },
            inputPlaceholder: 'Select sort option',
            showCancelButton: true,
        });

        if (selectedSort) {
            setSortBy(selectedSort);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Search Products</h1>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    name="keyword"
                    placeholder="Search by keyword"
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filters.keyword}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filters.category}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filters.minPrice}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                />
            </div>

            {/* Sorting */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
                <button
                    onClick={handleSortClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Sort By
                </button>
                <span className="text-gray-600 text-sm">Current: <strong>{sortBy.replace(/_/g, " ")}</strong></span>
            </div>

            {/* Product Results */}
            {products?.length === 0 ? (
                <p className="text-center text-gray-500">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-lg border border-gray-200 transition duration-300 cursor-pointer overflow-hidden"
                            onClick={() => navigate(`/product-info/${product._id}`)}
                        >
                            <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                                <img
                                    src={`https://ik.imagekit.io/0Shivams${product.images?.[0] || ""}`}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";
                                    }}
                                    className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                            <div className="p-4">
                                <h2 className="text-base font-semibold text-gray-800 truncate mb-1">{product.name}</h2>
                                <p className="text-green-700 font-bold text-sm">₹{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
};

export default SearchPage

