import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setUser } from "../store/User";
import axios from "axios";
import { z } from "zod";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});

    const schema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(15, "Username can't exceed more than 15 characters long"),
        password: z.string().min(3, "Password should be 3 character long")
    })

    const onSubmit = async (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Finding You!',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => Swal.showLoading(),
        });

        const result = schema.safeParse(form);
        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            Swal.close();
            return;
        } else setErrors({});

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/login`, form, { withCredentials: true });

            Swal.close();

            if (res.status === 200) {
                const user = res.data.user;
                dispatch(setUser(user));

                // Handle guest cart
                const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];

                if (guestCart.length > 0) {
                    await Promise.all(
                        guestCart.map(({ productId, quantity }) =>
                            axios.post(`${import.meta.env.VITE_BASE_URL}/api/cart/addToCart`, {
                                productId,
                                quantity,
                                userId: user._id,
                            }, { withCredentials: true })
                        )
                    );
                    localStorage.removeItem('guest_cart');
                }


                await Swal.fire({
                    icon: "success",
                    title: "Yay! Found You.",
                    timer: 1500,
                    showConfirmButton: false,
                });

                if (user.isAdmin) navigate("/admin/panel");
                else if (user.addresses.length === 0) navigate("/updateAddress");
                else navigate("/");
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err?.response?.data?.message || "Something went wrong!",
            });
        }
    };

    const handleForgotPassword = async () => {
        const { value: email } = await Swal.fire({
            title: 'Enter your email address',
            input: 'email',
            inputLabel: 'Email',
            inputPlaceholder: 'Enter your registered email',
            confirmButtonText: 'Send reset link',
            showCancelButton: true,
        });

        if (email) {
            try {
                Swal.fire({ title: 'Sending email...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/password/forgot-password`, { email });
                Swal.fire({ icon: 'success', title: 'Check your inbox!', text: res.data.msg });
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Oops!', text: err.response?.data?.msg || 'Something went wrong' });
            }
        }
    };

    return (
        <div className="flex pt-16 justify-center bg-white px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md bg-white border border-gray-300 rounded-lg p-6 sm:p-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                    Sign in to Your Account
                </h1>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
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

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
                    )}
                </div>

                <div className="text-right text-sm mb-6">
        <span
            onClick={handleForgotPassword}
            className="text-black font-semibold hover:underline cursor-pointer"
        >
          Forgot password?
        </span>
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-md font-semibold hover:opacity-90"
                >
                    Log In
                </button>

                <p className="text-center text-sm text-gray-700 mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-semibold text-black hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );

};

export default Login;
