import Swal from "sweetalert2";
import axios from "axios";

export const handleAddressClick = async ({
                                             address,
                                             cartItems,
                                             totalPrice,
                                             user,
                                             userCart,
                                             handlePayment,
                                         }) => {
    try {
        const weight = cartItems.map((item) => item.weight * item.quantity);

        const pinCodeChargeResponses = await Promise.all(
            weight.map((w) =>
                axios.get(`${import.meta.env.VITE_BASE_URL}/api/order/getCharges/${address.postalCode}/${w}`)
            )
        );

        const deliveryCharges = pinCodeChargeResponses.map(
            (res) => res?.data?.finalResult[0]?.freight_charge || 0
        );
        const estimatedDays = pinCodeChargeResponses.map(
            (res) => res?.data?.finalResult[0]?.estimated_delivery_days || "N/A"
        );

        const result1 = await Swal.fire({
            title: "Order Summary",
            text: `Delivery Charges ₹${deliveryCharges.join(', ')} and Estimated Days: ${estimatedDays.join(', ')}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Cancel',
        });

        if (!result1.isConfirmed) return;

        const result2 = await Swal.fire({
            title: 'Choose a Payment Method',
            icon: 'info',
            allowOutsideClick: true,
            allowEscapeKey: true,
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Cash On Delivery',
            cancelButtonText: 'Online',
        });

        const finalAmount = Math.ceil(
            totalPrice +
            deliveryCharges.reduce((acc, item) => acc + item, 0)
        );

        if (result2.isConfirmed) {
            handlePayment(address, "COD", finalAmount, deliveryCharges, estimatedDays, user, cartItems, userCart);
        } else if (result2.isDismissed) {
            handlePayment(address, "Prepaid", finalAmount, deliveryCharges, estimatedDays);
        }
    } catch (err) {
        console.error("Error in address click:", err);
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
};
