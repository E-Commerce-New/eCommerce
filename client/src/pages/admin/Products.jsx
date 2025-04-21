import { Bell, EllipsisVertical, RefreshCcw , LogOut} from "lucide-react";
import {useEffect, useState} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import { Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import RightTopNav from "../../components/reUsable/RightTopNav";
// import { IKContext, IKImage, IKUpload } from 'imagekitio-react';

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
    const [lastUpdated, setLastUpdated] = useState(null);
    const [categories , setCategories] = useState([]);
    // const [auth, setAuth] = useState()


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? files : value,
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

    //ImageKit
    const urlEndpoint = 'https://ik.imagekit.io/0Shivams';
    const publicKey = 'public_nwv07BA1aDK003/hEjq8qhETyD0=';

    const authenticator =  async () => {
        try {
            const response = await fetch('http://localhost:3000/auth');

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const { signature, expire, token } = data;
            console.log(data)
            return { signature, expire, token };
        } catch (error) {
            throw new Error(`Authentication request failed: ${error.message}`);
        }
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitted Form:", form);
        // setAuth(authenticator)
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("category", form.category);
            formData.append("price", form.price);
            formData.append("quantity", form.quantity);
            formData.append("active", form.active);
            // formData.append("image", form.image);
            formData.append("attributes", JSON.stringify(form.attributes));
            for(let i = 0;i < form.image.length;i++){
                formData.append('image', form.image[i])
            }
            console.log('console ', formData)
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

    const check = {
        "token": "c27c844e-42e4-4ee6-8618-d568c1dddf66",
        "expire": 17451543939,
        "signature": "b050cb33269f530157bb63f27d800b54ac9baf3d"
    }
    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/product/getProducts");
                console.log(res.data);
                setProducts(res.data.data);
                setLastUpdated(new Date());
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response?.data?.message || 'Something went wrong! Unable to fetch products.',
                });
            }
        };

        const getAllCategories = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/product/getCategories");
                setCategories(res.data.categories);
                console.log("Fetched categories:", res.data.categories);
            } catch (e) {
                console.log("Error fetching categories:", e);
            }
        };

        getAllCategories();
        getAllProducts();
    }, []);

    useEffect(()=> {
        console.log(categories);
    },[categories]);



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
                    {lastUpdated && (
                        <p className="flex gap-2 items-center">
                        <RefreshCcw onClick={()=>location.reload()}/> Last updated {dayjs(lastUpdated).fromNow()}
                        </p>
                    )}
                </div>
                <RightTopNav/>
            </div>
            <hr />

            {/*add product form*/}
            <div className="mb-4">
                <div className="flex justify-end">
                <button className="font-medium py-2 border-2 m-2 rounded-2xl border-black px-4 " onClick={()=>setShowAddProduct(!showAddProduct)}>Add Product</button>
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
                            {categories.map((cate) => (
                                <option key={cate._id} value={cate.category}>
                                    {cate.category}
                                </option>
                            ))}

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
                        accept="image/*"
                        onChange={handleChange}
                        multiple
                    />
                    {/*<IKContext*/}
                    {/*    publicKey={publicKey}*/}
                    {/*    urlEndpoint={urlEndpoint}*/}
                    {/*    authenticator={authenticator}*/}
                    {/*>*/}
                    {/*    <p>Upload an image</p>*/}
                    {/*    <IKUpload*/}
                    {/*        fileName="test-upload.png"*/}
                    {/*        onError={(error)=>{console.log(error)}}*/}
                    {/*        onSuccess={(success)=>{console.log('file uploaded successfully');console.log(success)}}*/}
                    {/*    />*/}
                    {/*</IKContext>*/}

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
                    {filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <tr key={product._id}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{product.name}</td>
                                <td className="border px-4 py-2">{product.description}</td>
                                <td className="border px-4 py-2">₹{product.price}</td>
                                <td className="border px-4 py-2">{product.quantity}</td>
                                <td className="border px-4 py-2">{product.category}</td>
                                <td className="border px-4 py-2">
                                    <input type="checkbox" checked={product.active} readOnly />
                                </td>
                                <td className="border px-4 py-2">
                                    {product.attributes && product.attributes.length > 0 ? (
                                        product.attributes.map((attr, idx) => (
                                            <div key={idx}>
                                                {attr.key || attr.value ? (
                                                    <>
                                                        <span className="font-medium">{attr.key || "N/A"}:</span> {attr.value || "N/A"}
                                                    </>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">N/A</span>
                                    )}
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
                                        className="bg-red-500 text-white p-1 py-1 rounded hover:bg-red-600"
                                    >
                                        <Trash2 />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center text-red-500 py-4">
                                No products found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

            </div>


        </>

    );
};

export default Products;
