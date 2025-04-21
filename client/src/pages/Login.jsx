import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setUser } from "../store/User";
import axios from "axios";
import { z } from "zod";

const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(4, "Password must be at least 4 characters"),
});

const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({ username: "", password: "" }); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();


        const result = loginSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors = result.error.format();
            setErrors({
                username: fieldErrors.username?._errors?.[0] || "",
                password: fieldErrors.password?._errors?.[0] || "",
            });
            return;
        }

        setErrors({ username: "", password: "" }); // clear old errors

        try {
            const res = await axios.post("http://localhost:3000/api/user/login", form, {
                headers: { "Content-Type": "application/json" },
            });

            dispatch(setUser(res.data.user));

            swal.fire({
                icon: "success",
                title: "Login Success",
                timer: 1500,
                showConfirmButton: false,
            });

            if (form.username === "admin") {
                navigate("/admin/panel");
            } else {
                navigate("/");
            }
        } catch (error) {
            swal.fire({
                title: "Login failed.",
                text: error.response?.data?.message || "Internal Server Error Occurred",
                icon: "error",
            });
        }
    };

    return (
        <>
            <form
                onSubmit={onSubmit}
                className="flex flex-col gap-2 p-4 border mt-52 w-[60%] ml-[20%] font-mono border-black"
            >
                <h1 className="text-center text-3xl font-medium font-mono">
                    Welcome Back! Login here
                </h1>

                <label>Username - </label>
                <input
                    type="text"
                    placeholder="Enter your Username"
                    className="border-b-2 border-black py-2 px-4 focus:outline-0"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>} {/* 👈 inline error */}

                <label>Password - </label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="border-b-2 border-black py-2 px-4 focus:outline-0"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>} {/* 👈 inline error */}

                <input type="submit" value="LogIn" className="bg-sky-200 p-2 cursor-pointer" />

                <p>
                    New here? <Link to="/signup" className="underline">SignUp Now</Link>
                </p>
            </form>
        </>
    );
};

export default Login;
