import { useParams } from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import swal from "sweetalert2";
import Swal from "sweetalert2";

const AddToCart = () => {
    const { productId, userId } = useParams();
    useEffect(() => {
        const handleAddToCart = async () => {
            Swal.fire({
                title: 'Adding To Cart',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                const res = await axios.post("http://localhost:3000/api/user/addToCart", {
                    productId,
                    userId,
                }, {
                    withCredentials: true
                });

                swal.close()
                if (res.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Added to cart",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            history.back();
                        }
                    });
                }

            } catch (err) {
                swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err,
                }).then((result) => {
                    if (result.isConfirmed) {
                        history.back();
                    }
                });
            }
        }
        handleAddToCart();
    },[productId, userId]);

    return null
};


export default AddToCart;