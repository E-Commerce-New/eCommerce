import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ResetPassword = () => {
    const {token} = useParams();
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/password/reset-password/${token}`, {newPassword: password});
            Swal.fire({icon: 'success', title: 'Password Reset Successful', timer: 1500});
            navigate('/login');
        } catch (error) {
            Swal.fire({icon: 'error', title: 'Link expired or invalid', timer: 1500});
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit}
                  className="bg-white p-8 rounded-xl shadow-xl flex flex-col gap-4 w-[90%] max-w-md">
                <h2 className="text-xl font-semibold text-center">🔒 Reset Your Password</h2>
                <input
                    type="password"
                    placeholder="New Password"
                    className="border p-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="bg-blue-500 text-white py-2 rounded">Update Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
