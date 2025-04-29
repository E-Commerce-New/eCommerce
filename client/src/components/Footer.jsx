import Newsletter from "../pages/customer/HomeSections/Newsletter.jsx";
import { MessageCircle } from "lucide-react";
import {useNavigate} from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer className=" border-t-2 border-black p-8 mt-16">
            <a className="fixed border-2 border-black rounded-[50%] bottom-0 right-0 m-10 p-5 bg-white hover:scale-105 transition-all"
               href="https://wa.me/8700011355"
               target="_blank"
            >
                <MessageCircle />
            </a>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">YourBrand</h2>
                    <p>Delivering Happiness Since 2025</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                    <ul className="space-y-1">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/explore" className="hover:underline">Shop</a></li>
                        <li><a href="/aboutUs" className="hover:underline">About</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Categories</h3>
                    <ul className="space-y-1">
                        <li><a href="/category/men" className="hover:underline">Men</a></li>
                        <li><a href="/category/women" className="hover:underline">Women</a></li>
                        <li><a href="/category/accessories" className="hover:underline">Accessories</a></li>
                    </ul>
                </div>

                <div>
                    <Newsletter/>
                </div>

            </div>

            <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex space-x-4 mb-4 md:mb-0">
                    <a href="#"><img src="/facebook.svg" alt="Facebook" className="h-6" /></a>
                    <a href="#"><img src="/instagram.svg" alt="Instagram" className="h-6" /></a>
                    <a href="#"><img src="/twitter.svg" alt="Twitter" className="h-6" /></a>
                </div>
                <div className="text-sm">
                    © 2025 YourBrand. All rights reserved.
                </div>
            </div>

        </footer>
    )
}

export default Footer;
