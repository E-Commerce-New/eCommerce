import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate();
    const [form , setForm] = useState({
        username: "",
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        phone: "",
        terms: true,
    })

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(form)
            try {
                const res = await axios.post("http://localhost:3000/api/user/register", form);
                alert(res.data.message);
                setForm({
                    username: "",
                    email: "",
                    password: "",
                    firstname: "",
                    lastname: "",
                    phone: "",
                    terms: true,
                });
                console.log(res.data)
                if(res.status === 200){
                    navigate('/')
                }
            } catch (err) {
                console.error(err);
                alert("Something went wrong");
            }
    }
    return (
        <>
            <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4 border mt-32 w-[60%] ml-[20%] font-mono border-black ">
                <h1 className="text-center text-3xl font-medium font-mono">Hey dude! SignUp here</h1>
                <label htmlFor="" className="">Username - </label>
                <input type="text" placeholder="Enter your Username" className="border-b-2 border-black py-2 px-4 focus:outline-0"
                       onChange={(e) => setForm({...form, username: e.target.value})}
                />
                <label htmlFor="" className="">Email - </label>
                <input type="email" placeholder="Enter your Email" className="border-b-2 border-black py-2 px-4 focus:outline-0"
                       onChange={(e) => setForm({...form, email: e.target.value})}
                />
                <label htmlFor="">Password - </label>
                <input type="password" placeholder="Enter your password" className="border-b-2 border-black py-2 px-4 focus:outline-0"
                       onChange={(e) => setForm({...form, password: e.target.value})}
                />
                <label htmlFor="">First Name - </label>
                <input type="text" placeholder="Enter your First Name" className="border-b-2 border-black py-2 px-4 focus:outline-0"
                       onChange={(e) => setForm({...form, firstname: e.target.value})}
                />
                <label htmlFor="">Last Name - </label>
                <input type="text" placeholder="Enter your Last Name" className="border-b-2 border-black py-2 px-4 focus:outline-0"
                       onChange={(e) => setForm({...form, lastname: e.target.value})}
                />
                <label htmlFor="">Mobile Number - </label>
                <input type="number" placeholder="Enter your Mobile Number" className="border-b-2 border-black py-2 px-4 focus:outline-0"
                       onChange={(e) => setForm({...form, phone: e.target.value})}
                />
                <div className="flex gap-2 items-center p-1">
                    <input
                        type="checkbox"
                        name="term"
                        id="term"
                        checked={form.terms}
                        onChange={e => setForm({ ...form, terms: e.target.checked })}
                    />
                    <p>
                        I hereby accept the{" "}
                        <Link className="underline" to="/termsandcondition">
                            Terms & Conditions
                        </Link>
                    </p>
                </div>

                <input type="submit" value="LogIn" className="bg-sky-200 p-2"/>
                <p>New here? <Link to="/signup" className="underline">SignUp Now</Link></p>
            </form>
        </>
    )
}

export default Signup;