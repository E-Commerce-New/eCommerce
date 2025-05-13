import axios from "axios";
import Swal from "sweetalert2";

const addToCart = async (productId, userId) => {
    try {
        Swal.fire({
            title: 'Adding To Cart',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/cart/addToCart`, {
            productId,
            userId,
        }, {
            withCredentials: true,
        });

        Swal.close();

        if (res.status === 200) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Added to cart',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        }

    } catch (err) {
        await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err?.response?.data?.message || "Something went wrong",
        });
    }
};

export default addToCart;