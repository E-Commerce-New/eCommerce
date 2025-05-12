import axios from "axios";
import Swal from "sweetalert2";

export const handlePayment = async (
    shippingAddress,
    paymentMethod,
    totalPrice,
    deliveryCharge,
    estimateDays,
    user,
    cartItems,
    userCart
) => {
    if (paymentMethod === "Prepaid") {
        console.log("Initiating Online Payment");

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/create-order`, {
                amount: totalPrice,
            });

            const options = {
                key: 'rzp_test_YkO4VIe1rAjpOw',
                amount: res.data.order.amount,
                currency: 'INR',
                name: 'Ecommerce',
                description: 'Store For You!',
                order_id: res.data.order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: user._id,
                            amount: res.data.order.amount / 100,
                        });

                        if (verifyRes.data.success) {
                            await Swal.fire({
                                title: 'Processing Your Order...',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                },
                            });

                            const placeRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/order/place`, {
                                cartItems,
                                shippingAddress,
                                totalPrice,
                                userId: user._id,
                                userCart,
                                paymentMethod,
                                deliveryCharge,
                                estimateDays,
                            });

                            if (placeRes.data.success) {
                                await Swal.fire("Success!", "Your order has been placed", "success");
                                window.location='/Orders'; // reload after confirmation
                            } else {
                                throw new Error("Order placement failed");
                            }
                        } else {
                            await Swal.fire("Failed", "Payment verification failed", "error");
                        }
                    } catch (e) {
                        console.log(e)
                        await Swal.fire({
                            title: 'Error!',
                            icon: 'error',
                            text: e.response?.data?.message || "Something went wrong during payment verification or order placement.",
                        });
                    }
                },
                prefill: {
                    name: `${user?.firstname} ${user?.lastname}`,
                    email: user?.email,
                    contact: user?.phone,
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', async (response) => {
                await Swal.fire({
                    title: 'Payment Failed',
                    icon: 'error',
                    text: response.error.description || 'Something went wrong during payment.',
                });
            });

            rzp.open();
        } catch (error) {
            await Swal.fire({
                title: 'Error!',
                icon: 'error',
                text: error.response?.data?.message || "Failed to initiate payment.",
            });
        }

    } else {
        // COD / Cash on Delivery
        try {
            Swal.fire({
                title: 'Placing Your COD Order...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            console.log("Sending Order Payload", {
                cartItems,
                shippingAddress,
                totalPrice,
                userId: user._id,
                userCart,
                paymentMethod,
                deliveryCharge,
                estimateDays
            });


            const placeRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/order/place`, {
                cartItems,
                shippingAddress,
                totalPrice,
                userId: user._id,
                userCart,
                paymentMethod,
                deliveryCharge,
                estimateDays,
            });


            if (placeRes.data.success) {
                Swal.close()
                await Swal.fire("Success!", "Your COD order has been placed", "success");
                window.location = '/Orders'//window.location.reload();
            }
        } catch (e) {
            await Swal.fire({
                title: 'Error!',
                icon: 'error',
                text: e.response?.data?.message || "Something went wrong with COD order.",
            });
        }
    }
};
