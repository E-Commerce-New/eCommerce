import { useParams } from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import swal from "sweetalert2";

const AddToCart = () => {
    const { productId, userId } = useParams();
    useEffect(() => {
        const handleAddToCart = async () => {
            try {
                const res = await axios.post("http://localhost:3000/api/user/addToCart", {
                    productId,
                    userId,
                }, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    swal.fire({
                        icon: "success",
                        title: "Added to cart",
                    })
                    history.back()
                }

            } catch (err) {
                swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err,
                })
                history.back()
            }
        }
        handleAddToCart();
    },[productId, userId]);

    return null
};


export default AddToCart;