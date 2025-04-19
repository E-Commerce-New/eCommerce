import { Bell, EllipsisVertical, RefreshCcw } from "lucide-react";
import {useEffect, useState} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import { Trash2 } from 'lucide-react';

const Products = () => {
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        image: null,
        active: false,
        attributes: [{ key: "", value: "" }],
    });
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
        }));
    };

    const handleAttributeChange = (index, field, value) => {
        const updated = [...form.attributes];
        updated[index][field] = value;
        setForm((prev) => ({ ...prev, attributes: updated }));
    };

    const addAttribute = (e) => {
        e.preventDefault();
        setForm((prev) => ({
            ...prev,
            attributes: [...prev.attributes, { key: "", value: "" }],
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitted Form:", form);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("category", form.category);
            formData.append("price", form.price);
            formData.append("quantity", form.quantity);
            formData.append("active", form.active);
            formData.append("image", form.image);
            formData.append("attributes", JSON.stringify(form.attributes));

            const res = await axios.post("http://localhost:3000/api/product/createProduct", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Product Added',
                text: res.data.message || 'Product has been successfully added!',
            });

            setForm({
                name: "",
                description: "",
                category: "",
                price: "",
                quantity: "",
                image: null,
                active: false,
                attributes: [{ key: "", value: "" }],
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Something went wrong!',
            });
        }
    };

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/product/getProducts");
                console.log(res.data);
                setProducts(res.data.data);
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response?.data?.message || 'Something went wrong!',
                })
            }
        }

        getAllProducts();
    },[])


    const handleEdit = (productId) => {
        navigate(`/admin/update-product/${productId}`);
    };

    const handeldelete = (productId) => {
        navigate(`/admin/delete-product/${productId}`);
    }

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price?.toString().includes(searchTerm)
    );



    return (
        <>
            {/*Header*/}
            <div className="flex justify-between pb-5 text-sm items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold">Products</h1>
                    <p className="flex gap-2 items-center">
                        <RefreshCcw /> Last Updated a while ago
                    </p>
                </div>
                <div className="flex gap-10 items-center">
                    <Bell />
                    <div className="flex gap-3 items-center">
                        <img
                            className="w-[50px] rounded-[50%]"
                            src="https://s3-alpha.figma.com/hub/file/2944732189/b47472b8-4e17-477e-a0a8-d5fcbed6a374-cover.png"
                            alt="Pfp"
                        />
                        <p>Admin Panel</p>
                    </div>
                    <EllipsisVertical />
                </div>
            </div>
            <hr />

            {/*add product form*/}
            <div className="mb-4">
                <div className="flex justify-end" onClick={()=>setShowAddProduct(!showAddProduct)}>
                <button className="font-medium py-2 border-2 m-2 border-black px-4">Add Product</button>
                </div>
                {showAddProduct ?
                <form onSubmit={onSubmit} encType="multipart/form-data" className="flex flex-col gap-2 p-4 border-2 border-black">
                    <h1 className="text-2xl font-mono font-bold">Add Product</h1>

                    <div className="flex flex-col gap-2">
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter Product Name here..."
                            className="border-b-2 border-black p-2"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter About Product here..."
                            className="border-b-2 border-black p-2"
                        />
                    </div>

                    <div>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="p-2 border-b-2 border-black bg-transparent"
                        >
                            <option value="">Select Category</option>
                            <option value="Computer">Computer</option>

                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Enter Product Price here..."
                            className="border-b-2 border-black p-2"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Quantity in Stock</label>
                        <input
                            type="number"
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            placeholder="Enter Product Quantity here..."
                            className="border-b-2 border-black p-2"
                        />
                    </div>

                    <input
                        type="file"
                        name="image"
                        accept="image/png"
                        onChange={handleChange}
                    />

                    <div className="flex flex-col gap-2">
                        <label>Attributes</label>
                        <div id="attr" className="flex flex-col gap-2">
                            {form.attributes.map((attr, index) => (
                                <div key={index} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        placeholder="Key"
                                        className="border-b-2 border-black p-2"
                                        value={attr.key}
                                        onChange={(e) =>
                                            handleAttributeChange(index, "key", e.target.value)
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        className="border-b-2 border-black p-2"
                                        value={attr.value}
                                        onChange={(e) =>
                                            handleAttributeChange(index, "value", e.target.value)
                                        }
                                    />
                                    {index === form.attributes.length - 1 && (
                                        <button
                                            className="border-2 border-black bg-sky-200 p-2 rounded-[50%] font-bold"
                                            onClick={addAttribute}
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="active">Active</label>
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={form.active}
                            onChange={handleChange}
                            className="border-2 border-black"
                        />
                    </div>

                    <input
                        type="submit"
                        className="border-b-2 border-black p-2 font-medium hover:bg-gray-200"
                        value="Add Product"
                    />
                </form> : "" }
            </div>


            {/*Show Products*/}
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
                    {filteredProducts.map((product, index) => (
                        <tr key={product._id}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.description}</td>
                            <td className="border px-4 py-2">₹{product.price}</td>
                            <td className="border px-4 py-2">{product.quantity}</td>
                            <td className="border px-4 py-2">{product.category}</td>
                            <td className="border px-4 py-2">
                                {product.active ? "Yes" : "No"}
                            </td>
                            <td className="border px-4 py-2">
                                {product.attributes.map(attr => (
                                    <div key={attr._id}>
                                        <span className="font-medium">{attr.key}:</span> {attr.value}
                                    </div>
                                ))}
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
                                    onClick={() => handeldelete(product._id)}
                                    className="bg-red-500 text-white p-1 py-1 rounded hover:bg-red-600 text-center"
                                >
                                    <Trash2/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>


        </>

    );
};

export default Products;
