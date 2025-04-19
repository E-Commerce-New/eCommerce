import { SquareArrowOutUpRight , LayoutTemplate ,LayoutGrid , ChartSpline , StickyNote , Package , Tag , Users , Mail , Plus} from "lucide-react"
import {Link} from "react-router-dom";

const AdminNavbar = () => {
    return (
        <>
            <div className="flex flex-col p-4 border-r-2 h-[100vh] fixed w-[14vw]">
            <div>
                <img src="" alt="Logo"/>
            </div>
                <hr className="bg-gray-400 h-[3px] mt-2" />
                <div className="flex flex-col mt-10 gap-3">
                    <input type="search" name="" id="" placeholder="Search" className="border border-gray-300 p-2 focus:outline-0" />
                    <div className="flex justify-between p-2 text-sm items-center">
                        <LayoutTemplate />
                    <p className="text-center">View Live Site </p>
                        <SquareArrowOutUpRight />
                    </div>
                </div>
                <hr className="bg-gray-400 h-[2px] mt-7" />
                <div className="flex flex-col mt-5 gap-6">
                    <Link to="/admin/panel" className="flex gap-3"> <LayoutGrid /> Overview </Link>
                    <div className="flex gap-3"> <ChartSpline /> Analytics </div>
                    <Link to="/admin/pages" className="flex gap-3 justify-between"> <div className="flex gap-3"> <StickyNote /> Pages </div> <Plus /> </Link>
                    <Link to="/admin/products" className="flex gap-3"> <Package /> Products </Link>
                    <div className="flex gap-3"> <Tag /> Tags </div>
                    <div className="flex gap-3 justify-between"> <div className="flex gap-3"> <Users /> Members </div> <Plus /> </div>
                    <div className="flex gap-3"> <Mail /> Inquiries </div>

                </div>

            </div>
        </>
    )
}

export default AdminNavbar;

