import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import swal from "sweetalert2"
import Swal from "sweetalert2"
import {useDispatch} from "react-redux";
import {setUser} from "../store/User";
import axios from "axios";
import {z} from "zod"

const Login = () => {
    const [form, setForm] = useState({
        username: "", password: "",
    })
    const [errors, setErrors] = useState({})

    const schema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(15, "Username can't exceed more than 15 characters long"),
        password: z.string().min(3, "Password should be 3 character long").max(15, "Password can't exceed more than 15 characters long"),
    })


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit = async (e) => {
        Swal.fire({
            title: 'Finding You!', allowOutsideClick: false, allowEscapeKey: false, didOpen: () => {
                Swal.showLoading();
            }
        });
        e.preventDefault()
        const result = schema.safeParse(form)
        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            swal.close()
            return
        } else {
            setErrors({});
        }
        try {
            const res = await axios.post("http://localhost:3000/api/user/login", form, {
                withCredentials: true
            })
            // console.log(res.data)
            dispatch(setUser(res.data.user))
            swal.close()
            if (res.status === 200) {
                swal.fire({
                    icon: "success", title: "Yay! Found You.", timer: 1500,
                })
                if (form.username === "admin") {
                    navigate("/admin/panel")
                } else navigate("/")
            } else if (res.status === 404) {
                swal.fire({
                    icon: "error", title: "You might need to Signup.", text: res.data.message, timer: 1500,
                })
            }
        } catch (error) {
            console.error(error)
            swal.fire({
                icon: "warning", title: "You might need to Signup.", timer: 1500,
            })
        }
    }

    const handleForgotPassword = async () => {
        const {value: email} = await Swal.fire({
            title: 'Enter your email address',
            input: 'email',
            inputLabel: 'Email',
            inputPlaceholder: 'Enter your registered email',
            confirmButtonText: 'Send reset link',
            showCancelButton: true
        });

        if (email) {
            try {
                Swal.fire({title: 'Sending email...', allowOutsideClick: false, didOpen: () => Swal.showLoading()});
                const res = await axios.post("http://localhost:3000/api/password/forgot-password", {email});

                Swal.fire({
                    icon: 'success', title: 'Check your inbox!', text: res.data.msg,
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error', title: 'Oops!', text: err.response?.data?.msg || 'Something went wrong',
                });
            }
        }
    };


    return (<>
            <div className="z-50 ml-[15%] mt-10
    w-[70%] overflow-y-scroll scrollbar-hide
    border rounded-2xl bg-white/30 backdrop-blur-md border-white/20
    shadow-2xl transition-all duration-500 ease-out">
                <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4 font-mono w-full">
                    <h1 className="text-center text-3xl font-medium font-mono">Welcome Back! Login here</h1>
                    <label htmlFor="" className="">Username - </label>
                    <input type="text" placeholder="Enter your Username"
                           className="border-b-2 border-black py-2 px-4 focus:outline-0"
                           onChange={(e) => setForm({...form, username: e.target.value})}
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username[0]}</p>}
                    <label htmlFor="">Password - </label>
                    <input type="text" placeholder="Enter your password"
                           className="border-b-2 border-black py-2 px-4 focus:outline-0"
                           onChange={(e) => setForm({...form, password: e.target.value})}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
                    <p className="mt-2 text-sm">
                        <span onClick={handleForgotPassword} className="underline text-blue-600 cursor-pointer">Forgot Password?</span>
                    </p>

                    <input type="submit" value="LogIn" className="bg-sky-200 p-2"/>
                    <p>New here? <Link to="/signup" className="underline">SignUp Now</Link></p>
                </form>
            </div>
        </>

    )
}

export default Login