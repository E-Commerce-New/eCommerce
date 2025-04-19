import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const UpdateProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/product/update/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };
        
        fetchProduct();
    }, [id]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Update Product</h1>
            {product ? (
                <pre className="bg-gray-100 p-4 mt-4 rounded">{JSON.stringify(product, null, 2)}</pre>
            ) : (
                <p>Loading product...</p>
            )}
        </div>
    );
};

export default UpdateProduct;
