import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react"; // install lucide-react or replace with SVG/icon

const Profile = () => {
    const { user } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        addresses: [],
    });

    useEffect(() => {
        const fetchUser = async () => {
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
            }
        };
        fetchUser();
    }, [user._id]);

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
        try {
            const payload = {
                id: user._id,
                username: formData.username,
                email: formData.email,
                firstname: formData.firstname,
                lastname: formData.lastname,
                phone: formData.phone,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                addresses: formData.addresses,
            };

            const res = await axios.put("http://localhost:3000/api/user/profileupdate", payload);

            if (res.status === 200) {
                alert("Profile updated successfully!");
            } else {
                alert("Something went wrong!");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating profile.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="capitalize text-2xl font-medium mb-4">
                Hey, {user.firstname}{" "}
                <span className="font-normal text-gray-700 text-xl">- Update your Profile here</span>
            </h1>

            <hr/>

            <form onSubmit={onSubmit} className="space-y-4 max-w-xl mt-5">
                {/* Basic Info Fields */}
                {["username", "email", "firstname", "lastname", "phone"].map(field => (
                        <div>
                    <label htmlFor="" className="capitalize">{field} :</label>
                    <input
                        key={field}
                        className="border-b-2 border-black p-2 w-full"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    />
                        </div>
                ))}

                {/* Passwords */}
                <input
                    className="border-b-2 border-black p-2 w-full"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Current Password"
                    type="password"
                />
                <input
                    className="border-b-2 border-black p-2 w-full"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="New Password"
                    type="password"
                />

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

                {formData.addresses.map((address, index) => (
                    <div key={index} className="border p-4 bg-gray-100 rounded-md space-y-2">
                        {["addressLine1", "addressLine2", "city", "state", "postalCode", "country"].map(field => (
                            <input
                                key={field}
                                className="border-b border-black p-1 w-full"
                                value={address[field]}
                                onChange={(e) => handleAddressChange(index, field, e.target.value)}
                                placeholder={field}
                            />
                        ))}
                        <select
                            className="p-1 border w-full"
                            value={address.type}
                            onChange={(e) => handleAddressChange(index, "type", e.target.value)}
                        >
                            <option value="shipping">Shipping</option>
                            <option value="billing">Billing</option>
                        </select>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={address.isDefault}
                                onChange={() => toggleDefault(index)}
                            />
                            <span>Default Address</span>
                        </label>
                    </div>
                ))}

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
