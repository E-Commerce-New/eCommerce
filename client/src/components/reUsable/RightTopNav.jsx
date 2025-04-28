import {Bell, EllipsisVertical, LogOut} from "lucide-react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {clearUserInfo} from "../../store/User.js";
import Swal from "sweetalert2";

const RightTopNav = () => {
    const [showdots, setShowdot] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        setShowdot(false);
        localStorage.clear()
        dispatch(clearUserInfo(null))
        navigate('/')
        Swal.close()
    }
    return (
        <>
            <div className="flex gap-10 items-center">
                <Bell/>
                <div className="flex gap-3 items-center">
                    <img
                        className="w-[50px] rounded-[50%]"
                        src="https://s3-alpha.figma.com/hub/file/2944732189/b47472b8-4e17-477e-a0a8-d5fcbed6a374-cover.png"
                        alt="Pfp"
                    />
                    <p>Admin Panel</p>
                </div>
                <div className="relative">
                    <EllipsisVertical onClick={() => setShowdot(!showdots)}/>
                    <div
                        className={`gap-2 items-center justify-between absolute top-8 p-2 right-0 bg-white ${showdots ? "flex" : "hidden"}`}>
                        <p className="px-10 py-2 border-2 border-black font-mono flex gap-2 items-center"
                           onClick={handleLogout}
                        >Logout <LogOut/></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RightTopNav;