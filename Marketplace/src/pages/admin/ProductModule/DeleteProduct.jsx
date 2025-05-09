import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateProduct = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const deleteProduct = async () => {
            Swal.fire({
                title: 'Deleting Product',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/product/delete/${id}`, {
                    withCredentials: true
                });
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: res.data.message || 'Product has been deleted!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/admin/products");
                    }
                })
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
