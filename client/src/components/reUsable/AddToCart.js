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

        const res = await axios.post("http://localhost:3000/api/user/addToCart", {
            productId,
            userId,
        }, {
            withCredentials: true,
        });

        Swal.close();

        if (res.status === 200) {
            await Swal.fire({
                icon: "success",
                title: "Added to cart",
                timer: 1500,
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