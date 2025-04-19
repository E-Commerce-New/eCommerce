import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const deleteProduct = async () => {
            try {
                const res = await axios.delete(`http://localhost:3000/api/product/delete/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: res.data.message || 'Product has been deleted!',
                });
                navigate("/admin/products");
            } catch (err) {
                console.error("Error deleting product:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.response?.data?.message || 'Failed to delete product',
                });
            }
        };

        deleteProduct();
    }, [id, navigate]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Deleting Product...</h1>
        </div>
    );
};

export default UpdateProduct;
