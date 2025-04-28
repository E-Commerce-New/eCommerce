import {useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";

const NewsletterForm = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/newsletter/subscribe`, {email});
            if (res.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Subscribed Successfully!",
                    timer: 1500,
                });
                setEmail("");
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Already Subscribed or Invalid!",
            });
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Subscribe to our Newsletter</h2>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Subscribe
                </button>
            </form>
        </div>
    );
};

export default NewsletterForm;
