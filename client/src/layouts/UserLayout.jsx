import React from "react";
import UserNavbar from "../components/Navbars/UserNavbar";
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer";

const UserLayout = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="relative">
                <div className="group hover:w-52 w-16 transition-all duration-300 h-full border-r-2 z-10 fixed">
                    <UserNavbar/>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-16 group-hover:ml-64 transition-all duration-300 p-4">
                <Outlet/>
                <Footer/>
            </div>
        </div>
    );
};


export default UserLayout;