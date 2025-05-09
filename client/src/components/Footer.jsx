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
                    <h3 className="text-lg font-semibold mb-2">Powered By</h3>
                    <ul className="space-y-1 ">
                        <li><a href="https://razorpay.com/" className="hover:cursor-pointer"><img src="https://razorpay.com/newsroom-content/uploads/2020/12/output-onlinepngtools-1-1.png" alt="" className='h-10'/></a></li>
                        <li><a href="https://www.shiprocket.in/" className="hover:cursor-pointer"><img src="https://sr-website.shiprocket.in/wp-content/uploads/2023/01/shiprocket_logo.svg" alt="" className='h-10'/></a></li>
                        <li><a href="https://www.geeksforgeeks.org/mern-stack/" className="hover:cursor-pointer"><img src="https://cdn-cjmik.nitrocdn.com/UjszoEMIGzQLBmRYICliaPmdTnvQlovN/assets/images/optimized/rev-b7b1dec/www.aalpha.net/wp-content/uploads/2023/11/MERN-Stack-technologies.png" alt="" className='h-12 -ml-3'/></a></li>
                    </ul>
                </div>

                <div>
                    <Newsletter/>
                </div>

            </div>

            <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex space-x-4 mb-4 md:mb-0">
                    <a href="#"><img src="https://play-lh.googleusercontent.com/KCMTYuiTrKom4Vyf0G4foetVOwhKWzNbHWumV73IXexAIy5TTgZipL52WTt8ICL-oIo=s96-rw" alt="Facebook" className="h-10 rounded-xl" /></a>
                    <a href="#"><img src="https://play-lh.googleusercontent.com/8Nu3gtUhArD8efOANJTSAyo9vuM_ZxRHENwHPmgFlVp2bgAzqJyhWpF-jLPF99I2LOao=w480-h960-rw" alt="Instagram" className="h-10 rounded-xl" /></a>
                    <a href="#"><img src="https://play-lh.googleusercontent.com/YvIeFtcOu07BNT4gVRmcS9Lq82Tp7Fs2gnFY65T9KGFJDFDx8US7JRSerAoBkG0fDA=w480-h960-rw" alt="Twitter" className="h-10 rounded-xl" /></a>
                </div>
                <div className="text-sm">
                    © 2025 YourBrand. All rights reserved.
                </div>
            </div>

        </footer>
    )
}

export default Footer;
