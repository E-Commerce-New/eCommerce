import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import swal from "sweetalert2"


const Login = () => {
    const [form , setForm] = useState({
        username: "",
        password: "",
    })
    const navigate = useNavigate();
    const onSubmit = async (e) => {
        e.preventDefault()
        console.log(form)
        try {
            const res = await fetch("http://localhost:3000/api/user/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            })
            const data = await res.json()
            console.log(data)
            if(res.status === 200) {
                swal.fire({
                    icon: "success",
                    title: "Login Success",
                    timer: 1500,
                })
                if (form.username === "admin") {
                    navigate("/admin/panel")
                } else navigate("/home")
            } else swal.fire({
                icon: "error",
                title: "Login Failed",
                text: data.message,
                timer: 1500,
            })
            } catch (error) {
            console.error(error)
            swal.fire({
                title: "Login failed.",
                text: "Internal Server Error Occured",
                icon: "error"
            })
        }
    }

    return (
        <>
            <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4 border mt-52 w-[60%] ml-[20%] font-mono border-black ">
            <h1 className="text-center text-3xl font-medium font-mono">Welcome Back! Login here</h1>
                <label htmlFor="" className="">Username - </label>
                <input type="text" placeholder="Enter your Username" className="border-b-2 border-black py-2 px-4 focus:outline-0"
                onChange={(e) => setForm({...form, username: e.target.value})}
                />
                <label htmlFor="">Password - </label>
                <input type="text" placeholder="Enter your password" className="border-b-2 border-black py-2 px-4 focus:outline-0"
                onChange={(e) => setForm({...form, password: e.target.value})}
                />
                <input type="submit" value="LogIn" className="bg-sky-200 p-2"/>
                <p>New here? <Link to="/signup" className="underline">SignUp Now</Link></p>
            </form>
        </>
    )
}

export default Login