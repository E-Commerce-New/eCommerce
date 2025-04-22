import React from "react";
import AdminNavbar from "../components/Navbars/UserNavbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx"

const UserLayout = () => {
    return (
        <div className="flex h-[100vh]">
            <div className="w-[10vw] border-r-2">
                <AdminNavbar />
            </div>
            <div style={{ flex: 1, padding: "20px" }}>
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default UserLayout;