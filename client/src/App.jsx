import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from "./pages/Login";
import NoPage from "./pages/NoPage";
import AdminPanel from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import Products from "./pages/admin/products";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LogIn />} />

                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="panel" element={<AdminPanel />} />
                    <Route path="products" element={<Products />} />
                </Route>

                
                <Route path="*" element={<NoPage />} />
            </Routes>
        </Router>
    );
}
