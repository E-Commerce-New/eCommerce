import {useEffect, useState} from "react";
import axios from "axios";
import {Trash2} from "lucide-react";
import Swal from "sweetalert2";

const Banner = () => {
    const [imageUrl, setImageUrl] = useState("");
    const [redirectUrl, setRedirectUrl] = useState("");
    const [banners, setBanners] = useState([]);
    const [showAddBanner, setShowAddBanner] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/ui/get`);
            if (res.data.success) {
                setBanners(res.data.data.banners);
            }
        };
        fetchBanners();
    }, [showAddBanner]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ui/create`, {
                imageUrl, redirectUrl,
            });
            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    timer: 2000,
                });
                setImageUrl("");
                setRedirectUrl("");
                setShowAddBanner(!showAddBanner);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteBanner = async (bannerId) => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/ui/deleteBanner/${bannerId}`);
                    if (res.data.success) {
                        Swal.fire({
                            icon: "success",
                            title: "Successfully Deleted",
                            timer: 1500,
                        }).then(() => {
                            setShowAddBanner(false);
                        });
                    } else {
                        alert("Failed to delete banner.");
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        icon: "warning",
                        title: "Error",
                        text: "An error occurred.",
                        timer: 1500,
                    });
                }
            }
        })
    };

    return (
        <>
            <div className="flex flex-col p-2">
                <h1 className="font-bold text-2xl">Add Banner #1st Section</h1>
                <p className="text-red-500">Recommended aspect ratio : Around 16:9 or 21:9.</p>
                <div>
                    <button className="py-2 px-5 border rounded-2xl bg-green-600 font-bold text-white"
                            onClick={() => setShowAddBanner(!showAddBanner)}
                    > Add Banner
                    </button>
                    {showAddBanner ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[50%] p-4">
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Redirect URL"
                                value={redirectUrl}
                                onChange={(e) => setRedirectUrl(e.target.value)}
                                className="border p-2 rounded"
                                required
                            />
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                Create Banner
                            </button>
                        </form>
                    ) : null}
                    {banners.map((banner, index) => (
                        <div className="flex flex-col p-2 w-full max-w-md border-b-2 border-black my-2"
                             key={banner._id}>
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex gap-2">
                                    <img src={banner.imageUrl} alt="Banner Image" className="h-full w-[20%]"/>
                                    <div className="flex flex-col overflow-hidden text-ellipsis">
                                        <p>{index + 1}. Redirect Url :-</p>
                                        <input type="text" value={banner.redirectUrl}/>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteBanner(banner._id)}
                                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                >
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Banner;
