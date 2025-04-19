import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from "./pages/Login";
import NoPage from "./pages/NoPage";
import AdminPanel from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import Products from "./pages/admin/products";
import UpdateProduct from "./pages/admin/updateProduct";
import DeleteProduct from "./pages/admin/DeleteProduct";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LogIn />} />

                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="panel" element={<AdminPanel />} />
                    <Route path="products" element={<Products />} />
                    <Route path="update-product/:id" element={<UpdateProduct />} />
                    <Route path="delete-product/:id" element={<DeleteProduct />} />
                </Route>

                
                <Route path="*" element={<NoPage />} />
            </Routes>
        </Router>
    );
}
