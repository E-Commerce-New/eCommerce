import {Trash2} from "lucide-react";
import {useNavigate} from "react-router-dom";
import swal from "sweetalert2";
import axios from "axios";

const ReadProducts = ({
                          filteredProducts, products, searchTerm, setSearchTerm, setProducts
                      }) => {

    const navigate = useNavigate();


    const handleEdit = (productId) => {
        navigate(`/admin/update-product/${productId}`);
    };

    const handledelete = (productId) => {
        navigate(`/admin/delete-product/${productId}`);
    }

    const changeActive = async (id, index) => {
        // alert(id)
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/updateisactive`, {id});
            if (res.status === 200) {
                swal.fire({
                    icon: "success", title: "Success", timer: 1500,
                }).then(() => {
                    setProducts(prev => {
                        const shallowCopy = [...prev];
                        shallowCopy[index] = {...shallowCopy[index], active: !shallowCopy[index].active};
                        return shallowCopy
                    })
                    return true;
                })
            }
        } catch (error) {
            swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            })
            console.error(error)
        }
    }


    return (<>
        <div className="p-4">
            <div className="flex justify-between items-center py-3 ">
                <h1 className="text-2xl font-bold">Product List</h1>
                <p>Total Fetched Products - {products.length}</p>
            </div>
            {/*search products */}
            <div>
                <input
                    type="text"
                    placeholder="Search by name, description, or price"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 px-4 py-2 border border-black rounded w-full sm:w-1/2 focus:outline-0"
                />
            </div>
            <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border px-4 py-2">S. No.</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Quantity</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Active</th>
                    <th className="border px-4 py-2">Attributes</th>
                    <th className="border px-4 py-2">Edit</th>
                    <th className="border px-4 py-2">Delete</th>
                </tr>
                </thead>

                <tbody>
                {filteredProducts && filteredProducts.length > 0 ? (filteredProducts.map((product, index) => (
                    <tr key={product._id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{product.name}</td>
                        <td className="border px-4 py-2">{product.description}</td>
                        <td className="border px-4 py-2">₹{product?.price?.toLocaleString()}</td>
                        <td className="border px-4 py-2">{product.quantity}</td>
                        <td className="border px-4 py-2">{product?.category?.category}</td>
                        <td className="border px-4 py-2"
                            onClick={() => changeActive(product._id, index)}>
                            <input type="checkbox" checked={product.active}/>
                        </td>
                        <td className="border px-4 py-2">
                            {product.attributes && product.attributes.length > 0 ? (product.attributes.map((attr, idx) => (
                                <div key={idx}>
                                    {attr.key || attr.value ? (<>
                                                        <span
                                                            className="font-medium">{attr.key || "N/A"}:</span> {attr.value || "N/A"}
                                    </>) : ("N/A")}
                                </div>))) : (<span className="text-gray-400 italic">N/A</span>)}
                        </td>
                        <td className="border px-4 py-2 text-center">
                            <button
                                onClick={() => handleEdit(product._id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                                Edit
                            </button>
                        </td>
                        <td className="border px-4 py-2 text-center">
                            <button
                                onClick={() => handledelete(product._id)}
                                className="bg-red-500 text-white p-1 py-1 rounded hover:bg-red-600"
                            >
                                <Trash2/>
                            </button>
                        </td>
                    </tr>))) : (<tr>
                    <td colSpan="10" className="text-center text-red-500 py-4">
                        No products found
                    </td>
                </tr>)}
                </tbody>
            </table>
        </div>
    </>)
}

export default ReadProducts;