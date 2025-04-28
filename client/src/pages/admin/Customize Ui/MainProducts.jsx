import {useEffect, useState} from "react";
import axios from "axios";

const MainProducts = () => {
    const [products, setProducts] = useState([]);
    const [mainProducts, setMainProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/getActiveProducts`);
                setProducts(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProducts();
    }, []);

    const handleSelect = (e) => {
        const selectedProductId = e.target.value;
        const selectedProduct = products.find(p => p._id === selectedProductId);
        if (selectedProduct) {
            setMainProducts((prev) => [...prev, selectedProduct]);
        }
    };

    const handleRemove = (productId) => {
        setMainProducts((prev) => prev.filter((product) => product._id !== productId));
    };

    const addMainProducts = async () => {
        try {
            const productIds = mainProducts.map(product => product._id);  // Only send product IDs
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ui/addMainProducts`, {productIds});
            if (res.status === 200) {
                alert("Products added successfully");
            }

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold px-4 py-2">List Your Main Products Here! #2nd Section</h1>
            <p className="text-red-500">We recommend you to add only best of product of yours</p>
            <p className="text-red-500">This Selection will clear your Last Selections</p>
            <div>
                <div>
                    <select
                        name=""
                        id=""
                        className="px-4 py-2 border-b-2 border-black bg-transparent"
                        onChange={handleSelect}
                    >
                        <option value="">Select Products</option>
                        {products.map((product) => (
                            <option key={product._id} value={product._id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <button className="px-5 py-2 border bg-green-300 mx-3 rounded-lg"
                            onClick={() => addMainProducts()}
                    >Add
                    </button>
                </div>
            </div>

            {/* Selected Products */}
            <div className="p-2 flex gap-2 text-nowrap flex-wrap mt-4">
                {mainProducts.map((product) => (
                    <div key={product._id} className="px-4 py-2 bg-green-200 rounded-2xl flex gap-3">
                        <p>{product.name}</p>
                        <button
                            className="px-2 bg-red-300"
                            onClick={() => handleRemove(product._id)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainProducts;
