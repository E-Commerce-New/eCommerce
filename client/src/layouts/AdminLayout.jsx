import React from "react";
import AdminNavbar from "../components/Navbars/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="flex h-[100vh]">
            <div className="w-[14vw]">
                <AdminNavbar />
            </div>
            <div style={{ flex: 1, padding: "20px" }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
