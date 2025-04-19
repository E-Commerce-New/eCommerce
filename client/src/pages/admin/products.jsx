import { Bell, EllipsisVertical, RefreshCcw } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Products = () => {
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

    return (
        <>
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

            <div>
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
                </form>
            </div>
        </>
    );
};

export default Products;
