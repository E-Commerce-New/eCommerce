import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Hybrid Imports
import LogIn from "./pages/Login";
import NoPage from "./pages/NoPage";
import SignUp from "./pages/Signup.jsx"
import Home from "./pages/Home.jsx"

// Admin Imports
import AdminPanel from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminCustomize from "./pages/admin/Customize.jsx"
import UpdateProduct from "./pages/admin/ProductModule/updateProduct.jsx";
import DeleteProduct from "./pages/admin/ProductModule/DeleteProduct.jsx";
import AdminOrders from "./pages/admin/Orders.jsx";
import AdminSettings from "./pages/admin/AdminSetting"
import Products from "./pages/admin/Products.jsx";

// Users Imports
import UserLayout from "./layouts/UserLayout"
import AddToCart from "./components/reUsable/AddToCart.js";
import Cart from "./pages/customer/Cart.jsx"
import Profile from "./pages/customer/profile.jsx"
import Explore from "./pages/customer/explore.jsx"
import AboutUs from "./pages/customer/About.jsx";
import Contact from "./pages/customer/Contact.jsx";
import Orders from "./pages/customer/Orders.jsx";
import ResetPassword from "./pages/customer/ResetPassword.jsx";
import ProductInfo from "./pages/customer/Product-info.jsx";


export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<Home />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="login" element={<LogIn />} />
                    <Route path="product-info/:id" element={<ProductInfo />} />
                    <Route path="add-to-cart/:productId/:userId" element={<AddToCart />} />
                    <Route path="Cart" element={<Cart />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="aboutUs" element={<AboutUs />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="panel" element={<AdminPanel />} />
                    <Route path="products" element={<Products />} />
                    <Route path="update-product/:id" element={<UpdateProduct />} />
                    <Route path="delete-product/:id" element={<DeleteProduct />} />
                    <Route path="setting" element={<AdminSettings />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customize" element={<AdminCustomize />} />
                </Route>

                <Route path="*" element={<NoPage />} />
            </Routes>
        </Router>
    );
}

// Loader
// Swal.fire({
//     title: 'Decreasing Quantity...',
//     allowOutsideClick: false,
//     allowEscapeKey: false,
//     didOpen: () => {
//         Swal.showLoading();
//     }
// });
