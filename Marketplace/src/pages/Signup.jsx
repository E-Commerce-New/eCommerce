import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../store/User.js';
import Swal from "sweetalert2";
import swal from "sweetalert2";
import {z} from "zod";
import {Eye, EyeClosed} from "lucide-react"

const Signup = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    useEffect(() => {
        if(user){
            navigate('/');
        }
    })
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        phone: "",
        terms: true,
    })
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [showpass, setShowpass] = useState(true);

    const schema = z.object({
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(15, "Username must be at most 15 characters"),
        email: z
            .string()
            .email("Please enter a valid email address"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(20, "Password must be at most 20 characters")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-])[A-Za-z\d!@#$%&*-]{6,}$/, "Password Must contain these - Special Symbols , 1 Uppercase letter, 1 Lowercase letter , 1 number"),
        firstname: z
            .string()
            .min(1, "First name is required"),
        lastname: z
            .string()
            .min(1, "Last name is required"),
        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/, "Phone number must be 10 digits and start with 6-9"),
        terms: z
            .literal(true)
            .refine(val => val === true, {
                message: "You must agree to the terms and conditions"
            })

    })

    const onSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Wait! We are signing up.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const result = schema.safeParse(form);
        if (!result.success) {
            swal.close();
            setErrors(result.error.flatten().fieldErrors);
            return;
        } else {
            setErrors({});
        }
        console.log(form)
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/register`, form);
            setForm({
                username: "",
                email: "",
                password: "",
                firstname: "",
                lastname: "",
                phone: "",
                terms: true,
            });
            console.log(res.data.user)
            dispatch(setUser(res.data.user));
            swal.close();
            if (res.status === 200) {
                navigate('/')
            }
        } catch (err) {
            console.error(err);
            if (err.response) {
                swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err.response.data.message || "Something went wrong",
                });
            } else {
                swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Server not responding or no response received",
                });
            }
        }

    }
    return (
        <div className="flex pt-16 justify-center bg-white px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md bg-white border border-gray-300 rounded-lg p-6 sm:p-8 shadow-md"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                    Create a New Account
                </h1>

                {/* Username */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        placeholder="your username"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-xs mt-1">{errors.username[0]}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="your email"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
                    )}
                </div>

                {/* Password with toggle */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type={showpass ? "password" : "text"}
                        placeholder="••••••••"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <div
                        className="absolute right-3 top-9 cursor-pointer text-gray-600"
                        onClick={() => setShowpass(!showpass)}
                    >
                        {showpass ? <Eye className="w-5 h-5" /> : <EyeClosed className="w-5 h-5" />}
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
                    )}
                </div>

                {/* First Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                        type="text"
                        placeholder="your first name"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black capitalize"
                        onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                    />
                    {errors.firstname && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstname[0]}</p>
                    )}
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                        type="text"
                        placeholder="your last name"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black capitalize"
                        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                    />
                    {errors.lastname && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastname[0]}</p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                        type="number"
                        placeholder="your mobile number"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>
                    )}
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6 flex items-start gap-2 text-sm">
                    <input
                        type="checkbox"
                        name="term"
                        id="term"
                        checked={form.terms}
                        onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                        className="mt-1"
                    />
                    <label htmlFor="term" className="text-gray-700">
                        I accept the{" "}
                        <Link to="/termsandcondition" className="underline font-medium text-black">
                            Terms & Conditions
                        </Link>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-md font-semibold hover:opacity-90"
                >
                    Sign Up
                </button>

                {/* Switch to Login */}
                <p className="text-center text-sm text-gray-700 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-black hover:underline">
                        Log in
                    </Link>
                </p>
            </form>
        </div>

    )
}

export default Signup;