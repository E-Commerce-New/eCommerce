import {useEffect, useState} from "react";
import axios from "axios";
import swal from "sweetalert2";
import Swal from "sweetalert2";

const Categories = () => {
    const [showCatForm, setShowCatForm] = useState(false);
    const [category, setCategory] = useState("");
    const [cateArray, setCateArray] = useState([]);

    const saveCategories = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Saving Category...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        console.log(category)
        if (!category) {
            alert("Category not found");
            return
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/addCategory`, {category: category}, {
                withCredentials: true
            });
            console.log(res.data)
            swal.close();
            if (res.status === 200) {
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

    useEffect(() => {
        const fetchCategories = async () => {
            Swal.fire({
                title: 'Loading categories...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/getCategories`, {
                    withCredentials: true
                });
                console.log(res.data.categories)
                setCateArray(res.data.categories);
            } catch (err) {
                console.log(err)
            } finally {
                Swal.close()
            }
        }

        fetchCategories();
    }, []);

    //Delete Category
    // const handlecatdelete = async (id) => {
    //     alert(id)
    //     try {
    //         const res = await axios.delete(`http://localhost:3000/api/product/deleteCategory/id:${id}`, {
    //             withCredentials: true
    //         })
    //         if (res.status === 200) {
    //             swal.fire({
    //                 icon: "success",
    //                 title: "Success",
    //                 text: res.data.message,
    //             })
    //         }
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    return (
        <>
            {/*Categories Section*/}
            <div className="p-2 flex flex-col gap-2">
                <div className="flex justify-between text-xl">
                    <p># Categories Section</p>
                    <button className="border p-2 px-6 py-2 border-black rounded-lg hover:bg-gray-200"
                            onClick={() => setShowCatForm(!showCatForm)}>Add Category
                    </button>
                </div>
                {showCatForm ?
                    <form onSubmit={saveCategories} className="flex gap-3 border-2 p-2 ">
                        <input type="text" placeholder="Enter Category Name" className="border-b-2 border-black p-2"
                               onChange={(e) => setCategory(e.target.value)}
                        />
                        <input type="submit" value="Add" className="border border-black p-2 rounded-lg px-6"/>
                    </form>
                    : null}

                <h1 className="text-2xl font-medium">Existing Categories</h1>
                <div className="flex flex-col gap-2">
                    {cateArray?.map((item, index) => {
                        return (
                            <div className="border p-2 flex justify-between ">
                                <div className="flex gap-2">
                                    <p>{index + 1}</p> <p>{item.category}</p>
                                </div>
                                {/*{Delete Category}*/}
                                {/*<p onClick={() => handlecatdelete(item._id)}><Trash2/></p>*/}
                            </div>
                        )
                    })}
                </div>

            </div>
        </>
    )
}

export default Categories;