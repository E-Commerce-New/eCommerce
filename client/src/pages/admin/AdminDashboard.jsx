import { RefreshCcw , Bell , EllipsisVertical , SquarePen , ChevronLeft,  ChevronRight} from 'lucide-react';

const AdminDashboard = () => {
    return (
        <>
            {/*Section One*/}
        <div className="flex justify-between pb-5 text-sm items-center">
            <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">Overview</h1>
            <p className="flex gap-2 items-center"><RefreshCcw />Last Updated a while ago</p>
            </div>
            <div className="flex gap-10 items-center">
            <Bell />
                <div className="flex gap-3 items-center">
                <img className="w-[50px] rounded-[50%]" src="https://s3-alpha.figma.com/hub/file/2944732189/b47472b8-4e17-477e-a0a8-d5fcbed6a374-cover.png" alt="Pfp"/>
                <p>Admin Panel</p>
                </div>
            <EllipsisVertical />
            </div>
        </div>
            <hr/>

            {/*section two */}
            <div className="p-2 flex justify-between items-center">
                <input type="date" defaultValue={new Date().toISOString().split("T")[0]} name="" id="" className="p-2 border "/>
                <div className="flex gap-2 items-center">
                    <button className="flex gap-2 p-2 items-center border"><RefreshCcw />Refresh</button>
                    <button className="flex gap-2 p-2 items-center border"><SquarePen />Edit Summary</button>
                </div>
            </div>

            {/*section three */}
            <div className="p-4 flex gap-2 items-center">
                <div className="border p-4 border-black w-[25%] bg-gradient-to-r from-[#1F0D8C] to-[#F5F4FF]  text-white">
                    <h1 className="text-3xl pb-10">12K</h1>
                    <p>Subscribers</p>
                </div>
               <div className="border p-4 border-black w-[25%] bg-gradient-to-r from-[#0058AA] to-[#F5F4FF] text-white">
                    <h1 className="text-3xl pb-10">50K</h1>
                    <p>Orders</p>
                </div>
               <div className="border p-4 border-black w-[25%] bg-gradient-to-r from-[#A82210] to-[#F5F4FF] text-white">
                    <h1 className="text-3xl pb-10">10</h1>
                    <p>Inquiry</p>
                </div>
               <div className="border p-4 border-black w-[25%] bg-gradient-to-r from-[#8C0D51] to-[#F5F4FF] text-white">
                    <h1 className="text-3xl pb-10">100k</h1>
                    <p>Revenue</p>
                </div>
            </div>

            {/*section four*/}
            <div className="p-2 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl ">Products</h1>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="flex gap-4 items-center p-2">
                        <ChevronLeft /> 5 of 10 <ChevronRight />
                    </div>
                    <input type="search" name="" id="" className="py-2 border border-black px-4" placeholder="Search"/>
                </div>

            </div>
        </>

    )
}

export default AdminDashboard