import React from "react";
import AdminNavbar from "../components/Navbars/UserNavbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx"

const UserLayout = () => {
    return (
        <div className="flex w-full h-screen overflow-hidden">
            <div className=" h-full">
                <AdminNavbar />
            </div>
            <div className="flex-1 h-full overflow-y-auto p-5 ">
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};


export default UserLayout;