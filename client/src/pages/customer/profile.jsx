import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import { z } from "zod";

const Profile = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        phone: "",
        currentPassword: "",
        addresses: [],
    });
    const [errors, setErrors] = useState({});

    const addressSchema = z.object({
        addressLine1: z.string().min(1, "Address Line 1 is required"),
        addressLine2: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        postalCode: z.string().min(4, "Postal Code is too short"),
        country: z.string().min(1, "Country is required"),
        isDefault: z.boolean(),
        type: z.enum(["shipping", "billing"]),
    });

    const formSchema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        firstname: z.string().min(1, "First name is required"),
        lastname: z.string().min(1, "Last name is required"),
        phone: z
            .string()
            .regex(/^\d{10}$/, "Phone must be 10 digits"),
        // currentPassword: z.string().min(1, "This is Field is must"),
        addresses: z.array(addressSchema).optional(),
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }

        const fetchUser = async () => {
        Swal.fire({
            title: 'Finding your account',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
            try {
                const res = await axios.post("http://localhost:3000/api/user/getUser", {
                    id: user._id,
                });
                if (res.status === 200) {
                    const { username, email, firstname, lastname, phone, addresses } = res.data.data;
                    setFormData(prev => ({
                        ...prev,
                        username,
                        email,
                        firstname,
                        lastname,
                        phone,
                        addresses: addresses || [],
                    }));
                }
            } catch (error) {
                console.log(error);
            } finally {
                Swal.close();
            }
        };
        fetchUser();
    }, [user?._id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddressChange = (index, field, value) => {
        const updated = [...formData.addresses];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, addresses: updated }));
    };

    const addNewAddress = () => {
        if (formData.addresses.length >= 4) return;
        setFormData(prev => ({
            ...prev,
            addresses: [...prev.addresses, {
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
                isDefault: false,
                type: "shipping"
            }]
        }));
    };

    const toggleDefault = (index) => {
        const updated = formData.addresses.map((addr, i) => ({
            ...addr,
            isDefault: i === index
        }));
        setFormData(prev => ({ ...prev, addresses: updated }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();


        Swal.fire({
            title: 'We are updating your profile...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });


        const result = formSchema.safeParse(formData);
        console.log("Validation result:", result);

        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            Swal.close();
            return;
        }


        setErrors({});

        try {
            const payload = {
                id: user._id,
                ...formData,
            };

            const res = await axios.put("http://localhost:3000/api/user/profileupdate", payload);

            Swal.close();

            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated Successfully',
                    text: res.data.message || 'Your profile has been updated!',
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: res.data.message || 'Something went wrong!',
                });
            }
        } catch (error) {
            Swal.close();
            console.error("Update error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Something went wrong!',
            });
        }
    };


    return (
        <div className="p-6">
            <h1 className="capitalize text-2xl font-medium mb-4">
                Hey, {user?.firstname}{" "}
                <span className="font-normal text-gray-700 text-xl">- Update your Profile here</span>
            </h1>

            <hr/>

            <form onSubmit={onSubmit} className="space-y-4 max-w-xl mt-5">
                {/* Basic Info Fields */}
                {["username", "email", "firstname", "lastname", "phone"].map((field) => (
                    <div key={field}>
                        <label htmlFor={field} className="capitalize">{field} :</label>
                        <input
                            className="border-b-2 border-black p-2 w-full"
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        />
                        {errors[field] && <p className="text-red-500 text-sm">{errors[field][0]}</p>}
                    </div>
                ))}


                {/* Address Section */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Addresses</h2>
                    {formData.addresses.length < 4 && (
                        <button
                            type="button"
                            className="bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1"
                            onClick={addNewAddress}
                        >
                            <Plus size={18} /> Add Address
                        </button>
                    )}
                </div>

                {formData.addresses.map((address, index) => {
                    return (
                        <>
                            <p>
                              Address - {index + 1}
                            </p>
                    <div key={index} className="border p-4 bg-gray-100 rounded-md space-y-2">
                        {["addressLine1", "addressLine2", "city", "state", "postalCode", "country"].map(field => (
                            <input
                                key={field}
                                className="border-b border-black px-4 py-2 w-full"
                                value={address[field]}
                                onChange={(e) => handleAddressChange(index, field, e.target.value)}
                                placeholder={field}
                            />
                        ))}
                        {/*<select*/}
                        {/*    className="p-1 border w-full"*/}
                        {/*    value={address.type}*/}
                        {/*    onChange={(e) => handleAddressChange(index, "type", e.target.value)}*/}
                        {/*>*/}
                        {/*    <option value="shipping">Shipping</option>*/}
                        {/*    <option value="billing">Billing</option>*/}
                        {/*</select>*/}
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={address.isDefault}
                                onChange={() => toggleDefault(index)}
                            />
                            <span>Default Address</span>
                        </label>
                    </div>
                        </>)
                })}

                {/* Passwords */}
                <div>
                    <label htmlFor="currentPassword" >Password :</label>
                    <input
                        className="border-b-2 border-black p-2 w-full"
                        name="currentPassword"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Password"
                        type="password"
                    />
                </div>
                {/*<input*/}
                {/*    className="border-b-2 border-black p-2 w-full"*/}
                {/*    name="newPassword"*/}
                {/*    value={formData.newPassword}*/}
                {/*    onChange={handleChange}*/}
                {/*    placeholder="New Password"*/}
                {/*    type="password"*/}
                {/*/>*/}

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default Profile;
