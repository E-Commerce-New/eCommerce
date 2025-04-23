import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from "./pages/Login";
import NoPage from "./pages/NoPage";
import AdminPanel from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import Products from "./pages/admin/Products.jsx";
import UpdateProduct from "./pages/admin/ProductModule/updateProduct.jsx";
import DeleteProduct from "./pages/admin/ProductModule/DeleteProduct.jsx";
import SignUp from "./pages/Signup.jsx"
import Home from "./pages/Home.jsx"
import UserLayout from "./layouts/UserLayout"
import AdminSettings from "./pages/admin/AdminSetting"
import ProductInfo from "./pages/customer/Product-info.jsx";
import AddToCart from "./components/reUsable/AddToCart.jsx";
import Cart from "./pages/customer/Cart.jsx"
import Profile from "./pages/customer/profile.jsx"
import Explore from "./pages/customer/explore.jsx"
import Swal from "sweetalert2";

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
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="panel" element={<AdminPanel />} />
                    <Route path="products" element={<Products />} />
                    <Route path="update-product/:id" element={<UpdateProduct />} />
                    <Route path="delete-product/:id" element={<DeleteProduct />} />
                    <Route path="setting" element={<AdminSettings />} />

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
