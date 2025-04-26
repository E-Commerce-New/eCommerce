import {
    SquareArrowOutUpRight,
    LayoutTemplate,
    LayoutGrid,
    Settings,
    HandCoins,
    Columns3Cog,
    ChartSpline,
    StickyNote,
    Package,
    Tag,
    Users,
    Mail,
    Plus
} from "lucide-react";
import {Link, useLocation} from "react-router-dom";
import logo from "../../assets/logo.png";

const AdminNavbar = () => {
    const location = useLocation();

    const nav = [
        { to: "/admin/panel", label: "Overview", icon: <LayoutGrid /> },
        { to: "/admin/products", label: "Product", icon: <Package /> },
        { to: "/admin/setting", label: "Setting", icon: <Settings /> },
        { to: "/admin/orders", label: "Orders", icon: <HandCoins /> },
        { to: "/admin/customize", label: "Customize UI", icon: <Columns3Cog /> },
    ];

    return (
        <div className="flex flex-col w-16 hover:w-52 transition-all duration-300 bg-white shadow-lg h-screen p-4 overflow-hidden group">

            <div className="flex items-center justify-center mb-6">
                <img src={logo} alt="Logo" className="w-10 h-10" />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 px-1 py-2">
                <LayoutTemplate className="min-w-5" />
                <Link to="/" className="truncate hidden group-hover:block">
                    View Live Site
                </Link>
                <SquareArrowOutUpRight className="min-w-5 hidden group-hover:block" />
            </div>

            <hr className="my-4 border-gray-300" />

            <nav className="flex flex-col gap-2">
                {nav.map(({ to, label, icon }) => {
                    const isActive = location.pathname.startsWith(to);

                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center gap-3 text-gray-800 px-2 py-2 rounded transition-all duration-200 ${
                                isActive ? 'border-l-4 border-black bg-gray-100' : 'hover:bg-gray-100'
                            }`}
                            title={label}
                        >
                            <span className="min-w-5">{icon}</span>
                            <span className="w-0  group-hover:w-full transition-all duration-1000 truncate">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default AdminNavbar;









{/*<nav className="flex flex-col gap-4">*/}
            {/*    <Link to="/admin/panel" className={`flex items-center gap-3 text-gray-800 ${location.pathname === "admin/products" ? "border-l-2 border-black" : null}`}>*/}
            {/*        <LayoutGrid className="min-w-5" />*/}
            {/*        <span className="hidden group-hover:block">Overview</span>*/}
            {/*    </Link>*/}
            {/*    <div className="flex items-center gap-3 text-gray-800">*/}
            {/*        <ChartSpline className="min-w-5" />*/}
            {/*        <span className="hidden group-hover:block">Analytics</span>*/}
            {/*    </div>*/}
            {/*    <Link to="/admin/pages" className="flex items-center justify-between text-gray-800">*/}
            {/*        <div className="flex items-center gap-3">*/}
            {/*            <StickyNote className="min-w-5" />*/}
            {/*            <span className="hidden group-hover:block">Pages</span>*/}
            {/*        </div>*/}
            {/*        <Plus className="hidden group-hover:block" />*/}
            {/*    </Link>*/}
            {/*    <Link to="/admin/products" className="flex items-center gap-3 text-gray-800">*/}
            {/*        <Package className="min-w-5" />*/}
            {/*        <span className="hidden group-hover:block">Products</span>*/}
            {/*    </Link>*/}
            {/*    <div className="flex items-center gap-3 text-gray-800">*/}
            {/*        <Tag className="min-w-5" />*/}
            {/*        <span className="hidden group-hover:block">Tags</span>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center justify-between text-gray-800">*/}
            {/*        <div className="flex items-center gap-3">*/}
            {/*            <Users className="min-w-5" />*/}
            {/*            <span className="hidden group-hover:block">Members</span>*/}
            {/*        </div>*/}
            {/*        <Plus className="hidden group-hover:block" />*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center gap-3 text-gray-800">*/}
            {/*        <Mail className="min-w-5" />*/}
            {/*        <span className="hidden group-hover:block">Inquiries</span>*/}
            {/*    </div>*/}
            {/*    <Link to="/admin/setting" className="flex items-center gap-3 text-gray-800">*/}
            {/*        <Settings className="min-w-5" />*/}
            {/*        <span className="hidden group-hover:block">Settings</span>*/}
            {/*    </Link>*/}
            {/*</nav>*/}
