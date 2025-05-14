import {Contact, Key, LayoutGrid, LogOut, Package, PackageSearch, Plus, ShoppingCart, Store, User} from "lucide-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import logo from "../../assets/logo.png";
import {useDispatch, useSelector} from "react-redux";
import {clearUserInfo} from '../../store/User.js';

const AdminNavbar = () => {
    const {user} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(clearUserInfo(null));
        localStorage.clear();
        navigate("/login");
    };

    const navLinks = [
        {to: "/", label: "Home", icon: <LayoutGrid/>},
        {to: "/explore", label: "Explore", icon: <PackageSearch/>},
        {to: "/aboutUs", label: "About Us", icon: <Store/>},
        {to: "/contact", label: "Contact", icon: <Contact/>},
        {to: "/cart", label: "Cart", icon: <ShoppingCart/>},
    ];

    const authLinks = user
        ? [
            {to: "/profile", label: "Profile", icon: <User/>},
            {to: "/Orders", label: "Orders", icon: <Package/>},
        ]
        : [
            {to: "/login", label: "LogIn", icon: <Key/>},
            {to: "/signup", label: "SignUp", icon: <Plus/>},
        ];

    return (
        <div
            className="group transition-all duration-300 ease-in-out hover:w-52 w-20 bg-white h-screen flex flex-col items-center p-4 border-r shadow-md">
            <img src={logo} alt="Logo" className="w-10 h-10 mb-4"/>

            <hr className="bg-gray-400 h-[2px] w-full mt-2 mb-4"/>

            <nav className="flex flex-col gap-2 w-full">
                {[...navLinks, ...authLinks].map(({to, label, icon}) => (
                    <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-4 p-2 rounded-md w-full transition-all duration-200 hover:bg-gray-100 ${
                            location.pathname === to ? "border-l-4 border-black bg-gray-100" : ""
                        }`}
                        title={label}
                    >
                        <div className="text-lg">{icon}</div>
                        <span
                            className="text-sm font-medium w-0 overflow-hidden group-hover:inline group-hover:w-full transition-all duration-1000 text-nowrap">
              {label}
            </span>
                    </Link>
                ))}

                {user && (
                    <div
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-2 rounded-md w-full transition-all duration-200 hover:bg-gray-100 cursor-pointer"
                    >
                        <LogOut/>
                        <span className="text-sm font-medium hidden group-hover:inline">
              Logout
            </span>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default AdminNavbar;
