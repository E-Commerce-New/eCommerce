import axios from "axios";
import swal from "sweetalert2";
import Swal from "sweetalert2";

export const handlePayment = async (shippingAddress, paymentMethod, totalPrice, deliveryCharge, estimateDays, user, cartItems, userCart) => {
    // console.log("Payment Method", totalPrice, paymentMethod, shippingAddress, deliveryCharge, estimateDays)
    if (paymentMethod === "Prepaid") {
        console.log("Online Payment")
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/create-order`, {amount: totalPrice});
        //console.log("1st Api of CreateProducts Order" , res)
        console.log(res.data)

        const options = {
            key: 'rzp_test_YkO4VIe1rAjpOw',
            amount: res.data.order.amount,
            currency: 'INR',
            name: 'Ecommerce',
            description: 'Store For You!',
            order_id: res.data.order.id,
            handler: async function (response) {
                console.log(response);
                const verifyRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/verify`, {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: user._id,
                    amount: res.data.order.amount / 100,
                });
                console.log("2nd Verify Api", verifyRes);

                if (verifyRes.data.success) {
                    swal.fire({
                        title: 'Processing Your Order',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    try {
                        const placeRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/order/place`, {
                            // cartItems, shippingAddress, paymentInfo: response, totalPrice, userId: user._id,
                            cartItems,
                            shippingAddress,
                            totalPrice,
                            userId: user._id,
                            userCart,
                            paymentMethod,
                            deliveryCharge,
                            estimateDays
                        });
                        console.log("3rd Save data Api", placeRes);

                        if (placeRes.data.success) {
                            swal.close()
                            swal.fire("Success!", "Your order has been placed", "success").then((result) => {
                                if (result.isConfirmed) {
                                    location.reload();
                                }
                            })
                        }
                    } catch (e) {
                        swal.close()
                        swal.fire({
                            title: 'Error!', icon: 'error', text: e.response?.data?.message || "Something went wrong",
                        })
                    }
                } else {
                    swal.fire("Failed", "Payment verification failed", "error");
                }

            },
            prefill: {
                name: user?.firstname + ' ' + user?.lastname, email: user?.email, contact: user.phone,
            },
            theme: {
                color: '#3399cc',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/order/place`, {
            cartItems,
            shippingAddress,
            totalPrice,
            userId: user._id,
            userCart,
            paymentMethod,
            deliveryCharge,
            estimateDays
        });
    }

};