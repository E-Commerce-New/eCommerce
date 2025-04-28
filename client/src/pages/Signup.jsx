import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {useDispatch} from 'react-redux';
import {setUser} from '../store/User.js';
import Swal from "sweetalert2";
import swal from "sweetalert2";
import {z} from "zod";
import {Eye, EyeClosed} from "lucide-react"

const Signup = () => {
    const navigate = useNavigate();
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
            .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
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
            const res = await axios.post("http://localhost:3000/api/user/register", form);
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
        <>
            <div className="ml-[20%] mt-10 z-50
    w-[60%] overflow-y-scroll scrollbar-hide
    border rounded-2xl bg-white/30 backdrop-blur-md border-white/20
    shadow-2xl transition-all duration-500 ease-out">
                <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4 mt-10 font-mono ">
                    <h1 className="text-center text-3xl font-medium font-mono">Hey dude! SignUp here</h1>
                    <label htmlFor="" className="">Username - </label>
                    <input type="text" placeholder="Enter your Username"
                           className="border-b-2 border-black py-2 px-4 focus:outline-0"
                           onChange={(e) => setForm({...form, username: e.target.value})}
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username[0]}</p>}
                    <label htmlFor="" className="">Email - </label>
                    <input type="email" placeholder="Enter your Email"
                           className="border-b-2 border-black py-2 px-4 focus:outline-0"
                           onChange={(e) => setForm({...form, email: e.target.value})}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="">Password - </label>
                        <input type={showpass ? "password" : "text"} placeholder="Enter your password"
                               className="border-b-2 border-black py-2 px-4 focus:outline-0"
                               onChange={(e) => setForm({...form, password: e.target.value})}
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
                    {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
                    <label htmlFor="">First Name - </label>
                    <input type="text" placeholder="Enter your First Name"
                           className="border-b-2 border-black py-2 px-4 focus:outline-0 capitalize"
                           onChange={(e) => setForm({...form, firstname: e.target.value})}
                    />
                    {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname[0]}</p>}
                    <label htmlFor="">Last Name - </label>
                    <input type="text" placeholder="Enter your Last Name"
                           className="border-b-2 border-black py-2 px-4 focus:outline-0"
                           onChange={(e) => setForm({...form, lastname: e.target.value})}
                    />
                    {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname[0]}</p>}
                    <label htmlFor="">Mobile Number - </label>
                    <input type="number" placeholder="Enter your Mobile Number"
                           className="border-b-2 border-black py-2 px-4 focus:outline-0"
                           onChange={(e) => setForm({...form, phone: e.target.value})}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone[0]}</p>}
                    <div className="flex gap-2 items-center p-1">
                        <input
                            type="checkbox"
                            name="term"
                            id="term"
                            checked={form.terms}
                            onChange={e => setForm({...form, terms: e.target.checked})}
                        />
                        <p>
                            I hereby accept the{" "}
                            <Link className="underline" to="/termsandcondition">
                                Terms & Conditions
                            </Link>
                        </p>
                    </div>

                    <input type="submit" value="Sign Up" className="bg-sky-200 p-2"/>
                    <p>Already have an account? <Link to="/login" className="underline">LogIn Now</Link></p>
                </form>
            </div>
        </>
    )
}

export default Signup;