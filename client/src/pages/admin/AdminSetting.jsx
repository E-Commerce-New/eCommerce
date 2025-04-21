import {RefreshCcw} from "lucide-react";
import RightTopNav from "../../components/reUsable/RightTopNav.jsx";
import {useState} from "react";
import axios from "axios";
import swal from "sweetalert2";

const AdminSettings = () => {
    const [showCatForm , setShowCatForm] = useState(false);
    const [category , setCategory] = useState("");

    const saveCategories = async (e) => {
        e.preventDefault();
        console.log(category)
        if (!category) {
            alert("Category not found");
            return
        }
        try {
            const res = await axios.post("http://localhost:3000/api/product/addCategory", {category: category}, {
                withCredentials: true
            });
            console.log(res.data)
            if(res.status === 200) {
                swal.fire({
                    icon: "success",
                    title: "Success",
                    text: res.data.message,
                })
            } else {
                swal.fire({
                    icon: "error",
                    title: "Error",
                    text: res.data.message,
                })
            }
        } catch (e) {
        console.log(e);
        swal.fire({
            icon: "error",
            title: "Error",
            text: e.message,
        })
        }
    }

    return (
        <>
            {/*Section One*/}
            <div className="flex justify-between pb-5 text-sm items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold">Settings</h1>
                </div>
                <RightTopNav/>
            </div>
            <hr/>

            {/*Categories Section*/}
            <div className="p-2 flex flex-col gap-2">
                <div className="flex justify-between text-xl">
                    <p>Categories Section</p>
                <button className="border p-2 px-6 py-2 border-black rounded-lg hover:bg-gray-200" onClick={()=>setShowCatForm(!showCatForm)}>Add Category</button>
                </div>
                {showCatForm ?
                    <form onSubmit={saveCategories} className="flex gap-3 border-2 p-2 ">
                        <input type="text" placeholder="Enter Category Name" className="border-b-2 border-black p-2"
                        onChange={(e) => setCategory(e.target.value)}
                        />
                        <input type="submit" value="Add" className="border border-black p-2 rounded-lg px-6"/>
                    </form>
                : null}

            </div>



        </>
    )
}

export default AdminSettings;