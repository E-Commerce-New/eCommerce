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
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Search Products</h1>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <input
                    type="text"
                    name="keyword"
                    placeholder="Search by keyword"
                    className="p-2 border rounded"
                    value={filters.keyword}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    className="p-2 border rounded"
                    value={filters.category}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    className="p-2 border rounded"
                    value={filters.minPrice}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    className="p-2 border rounded"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                />
            </div>

            {/* Sorting Button */}
            <div className="mb-6">
                <button
                    onClick={handleSortClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Sort By
                </button>
                <span className="ml-4 text-gray-600">Current: {sortBy.replace(/_/g, " ")}</span>
            </div>

            {/* Product Results */}
            {products?.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products?.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-300 overflow-hidden"
                            onClick={()=>navigate(`/product-info/${product._id}`)}
                        >
                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
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

                            <div className="p-4 flex flex-col">
                                <h2 className="text-lg font-semibold mb-2 truncate">{product.name}</h2>
                                <p className="text-gray-700 font-bold text-md">₹{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default SearchPage

