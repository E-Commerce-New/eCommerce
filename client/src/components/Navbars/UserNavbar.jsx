import {  LayoutGrid ,  Plus , PackageSearch , Store,  Contact , Key , LogOut , User , ShoppingCart} from "lucide-react"
import {Link} from "react-router-dom";
import logo from "../../assets/logo.png"
import {useDispatch, useSelector} from "react-redux";
import { clearUserInfo } from '../../store/User.js';

const AdminNavbar = () => {
    const {user} = useSelector(state => state.user)
    console.log(user)
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(clearUserInfo(null))
        localStorage.clear();
    }
    return (
        <>
            <div className="flex flex-col p-4">
                <div>
                    <img src={logo} alt="Logo"/>
                </div>

                <hr className="bg-gray-400 h-[2px] mt-7" />
                <div className="flex flex-col mt-5 gap-6">
                    <Link to="/" className="flex gap-2"> <LayoutGrid /> Home </Link>
                    <Link to="/explore" className="flex gap-2"><PackageSearch /> Explore</Link>
                    <Link to="/aboutUs" className="flex gap-2"><Store /> About Us</Link>
                    <Link to="/contact" className="flex gap-2"><Contact /> Contact</Link>
                    {user ?
                        <>
                        <div onClick={handleLogout} className="flex gap-2"><LogOut/>Logout</div>
                        <Link to="/profile" className="flex gap-2"><User/>Profile</Link>
                        <Link to="/cart" className="flex gap-2"><ShoppingCart />Cart</Link>
                        </>
                    :
                        <>
                    <Link to="/login" className="flex gap-2"><Key />LogIn</Link>
                    <Link to="/signup" className="flex gap-2"> <Plus/> SignUp</Link>
                        </>
                    }
                </div>

            </div>
        </>
    )
}

export default AdminNavbar;

