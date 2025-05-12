import {useEffect} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const CheckAddress = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        {user ?
        Swal.fire({
            title: "Enter Your Address",
            text: "You're trying to change your address.",
            html: `
                    <input id="addressLine1" class="swal2-input" placeholder="Address Line 1" required>
                    <input id="addressLine2" class="swal2-input" placeholder="Address Line 2">
                    <input id="city" class="swal2-input" placeholder="City" required>
                    <input id="state" class="swal2-input" placeholder="State" required>
                    <input type="number" id="postalCode" class="swal2-input" placeholder="Postal Code" required>
                    <input id="country" class="swal2-input" placeholder="Country" required>
                `,
            showCancelButton: false,
            confirmButtonText: "Save Address",
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: async () => {
                const address = {
                    addressLine1: document.getElementById("addressLine1").value,
                    addressLine2: document.getElementById("addressLine2").value,
                    city: document.getElementById("city").value,
                    state: document.getElementById("state").value,
                    postalCode: document.getElementById("postalCode").value,
                    country: document.getElementById("country").value,
                };

                if (!address.addressLine1 || !address.city || !address.state || !address.postalCode || !address.country) {
                    Swal.showValidationMessage("Please fill in all required fields.");
                    return false;
                }

                try {
                    const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/updateUserAddress`, {
                        id: user._id,
                        addresses: [address]
                    });
                    return res.data;
                } catch (err) {
                    Swal.showValidationMessage(`Failed to save address: ${err.response?.data?.message || err.message}`);
                }

            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Saved!", "Your address has been updated.", "success");
                navigate("/")
            }
        })
            : null }

    })
    return null;
};

export default CheckAddress;
