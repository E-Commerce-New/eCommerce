import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {Eye, EyeClosed, Plus} from "lucide-react";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {z} from "zod";
import {setUser} from "../../store/User.js";

const Profile = () => {
    const {user} = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        // else if(user?.isAdmin){
        //     navigate('/admin/panel');
        // }
    }, []);
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
    const [placesOptions, setPlacesOptions] = useState([]);
    const [manualCityEntry, setManualCityEntry] = useState([]);
    const [showpass, setShowpass] = useState(true);
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
                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/getUser`, {
                    id: user._id,
                });
                if (res.status === 200) {
                    const {username, email, firstname, lastname, phone, addresses} = res.data.data;
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
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddressChange = async (index, field, value) => {
        const updatedAddresses = [...formData.addresses];
        const updatedPlaces = [...placesOptions];
        const updatedManualEntry = [...manualCityEntry];

        updatedAddresses[index][field] = value;

        if (field === "postalCode") {
            if (value.length === 6) {
                try {
                    const res = await fetch(`https://api.zippopotam.us/IN/${value}`);
                    if (!res.ok) throw new Error("Invalid PIN Code");
                    const data = await res.json();

                    const placeList = data.places.map((p) => p["place name"]);

                    updatedAddresses[index].state = data.places[0]?.state || "";
                    updatedAddresses[index].country = data.country || "";
                    updatedAddresses[index].city = placeList[0] || "";

                    updatedPlaces[index] = placeList;
                    updatedManualEntry[index] = false;
                } catch (error) {
                    console.error("Postal code error:", error);
                    updatedAddresses[index].state = "";
                    updatedAddresses[index].country = "";
                    updatedAddresses[index].city = "";
                    updatedPlaces[index] = [];
                    updatedManualEntry[index] = false;
                }
            } else {
                updatedAddresses[index].city = "";
                updatedAddresses[index].state = "";
                updatedAddresses[index].country = "";
                updatedPlaces[index] = [];
                updatedManualEntry[index] = false;
            }
        }

        if (field === "city" && value === "manual") {
            updatedAddresses[index].city = "";
            updatedManualEntry[index] = true;
        }

        setFormData((prev) => ({...prev, addresses: updatedAddresses}));
        setPlacesOptions(updatedPlaces);
        setManualCityEntry(updatedManualEntry);
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
        setFormData(prev => ({...prev, addresses: updated}));
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
            const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/profileupdate`, payload);

            Swal.close();

            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated Successfully',
                    text: res.data.message || 'Your profile has been updated!',
                    timer: 1500
                });
                dispatch(setUser(res.data.user));
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
        <div className="mt-5 p-4 w-[70%] ml-[15%] h-[80vh] overflow-y-scroll scrollbar-hide
        border rounded-2xl bg-white
        shadow-2xl transform-gpu
        hover:scale-[1.02] hover:-rotate-x-1 hover:rotate-y-1
        transition-all duration-300 ease-in-out
        bg-white/30 backdrop-blur-md border-white/20">
            <h1 className="capitalize text-2xl font-medium mb-4">
                Hey, {user?.firstname}{" "}
                <span className="font-normal text-gray-700 text-xl">- Update your Profile here</span>
            </h1>

            <hr/>

            <div className="flex justify-between">
                <form onSubmit={onSubmit} className="space-y-4 mt-5 w-[65%] ">
                    {/* Basic Info Fields */}
                    {["username", "email", "firstname", "lastname", "phone"].map((field) => (
                        <div key={field}>
                            <label htmlFor={field} className="capitalize">{field} :</label>
                            <input
                                className={`border-b-2 border-black p-2 w-full ${field === "email" ? null : "capitalize"}`}
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
                                <Plus size={18}/> Add Address
                            </button>
                        )}
                    </div>

                    {formData.addresses.map((address, index) => (
                        <div key={index} className="border p-4 bg-gray-100 rounded-md space-y-2">
                            {["postalCode", "addressLine1", "addressLine2"].map(field => (
                                <input
                                    key={field}
                                    className="border-b border-black px-4 py-2 w-full"
                                    value={address[field]}
                                    onChange={(e) => handleAddressChange(index, field, e.target.value)}
                                    placeholder={field}
                                />
                            ))}

                            {/* City field with dropdown/manual entry switch */}
                            {placesOptions[index]?.length > 1 && !manualCityEntry[index] ? (
                                <>
                                    <select
                                        className="border-b border-black px-4 py-2 w-full"
                                        value={address.city}
                                        onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                                    >
                                        {placesOptions[index].map((place, i) => (
                                            <option key={i} value={place}>{place}</option>
                                        ))}
                                        <option value="manual">Other (Enter Manually)</option>
                                    </select>
                                </>
                            ) : (
                                <input
                                    className="border-b border-black px-4 py-2 w-full"
                                    value={address.city}
                                    onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                                    placeholder="City"
                                />
                            )}

                            <input
                                className="border-b border-black px-4 py-2 w-full"
                                value={address.state}
                                onChange={(e) => handleAddressChange(index, "state", e.target.value)}
                                placeholder="State"
                            />
                            <input
                                className="border-b border-black px-4 py-2 w-full"
                                value={address.country}
                                onChange={(e) => handleAddressChange(index, "country", e.target.value)}
                                placeholder="Country"
                            />

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


                    {/* Passwords */}
                    <div className='relative'>
                        <label htmlFor="currentPassword">Password :</label>
                        <input
                            type={showpass ? "password" : "text"}
                            className="border-b-2 border-black p-2 w-full"
                            name="currentPassword"
                            id="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                        <p className="absolute right-0 bottom-0 px-10 py-2 cursor-pointer"
                           onClick={() => setShowpass(!showpass)}>
                            {showpass ?
                                <Eye/>
                                :
                                <EyeClosed/>
                            }
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Update Profile
                    </button>
                </form>

                <div className="w-[30%] m-2">
                    Quick Links will be here
                </div>
            </div>
        </div>
    );
};

export default Profile;
