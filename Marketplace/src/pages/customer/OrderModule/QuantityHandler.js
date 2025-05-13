import Swal from "sweetalert2";
import axios from "axios";

export const increaseQuantity = async (userId, productId , cartUpdated , setCartUpdated) => {
    Swal.fire({
        title: 'Increasing Product Quantity...', allowOutsideClick: false, allowEscapeKey: false, didOpen: () => {
            Swal.showLoading();
        }
    });
    try {
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/cart/increase`, {
            userId, productId,
        });
        setCartUpdated(!cartUpdated);
    } catch (err) {
        console.error(err);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Failed to add item',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });
    }
};

export const decreaseQuantity = async (userId, productId , cartUpdated , setCartUpdated) => {
    Swal.fire({
        title: 'Decreasing Quantity...', allowOutsideClick: false, allowEscapeKey: false, didOpen: () => {
            Swal.showLoading();
        }
    });
    try {
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/cart/decrease`, {
            userId, productId,
        });
        setCartUpdated(!cartUpdated);
    } catch (err) {
        console.error(err);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Failed to remove item',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });
    }
};

export const deleteCartItem = async (userId, productId, cartUpdated, setCartUpdated) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    Swal.fire({
        title: 'Deleting Item...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/cart/delete`, {
            data: { userId, productId }
        });

        setCartUpdated(!cartUpdated);

    } catch (err) {
        console.error(err);
        await Swal.fire({
            icon: "error",
            title: "Failed to delete item",
            text: err?.response?.data?.message || "An error occurred",
        });
    } finally {
        Swal.close();
    }
};
