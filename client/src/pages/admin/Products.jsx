import {RefreshCcw} from "lucide-react";
import {useEffect, useState} from "react";
import Swal from "sweetalert2";
import swal from "sweetalert2";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import RightTopNav from "../../components/reUsable/RightTopNav";
import Categories from "../../components/Categories";
import {useSelector} from "react-redux";
import AddProduct from "./ProductModule/AddProduct.jsx";
import ShowProducts from "./ProductModule/ShowProducts.jsx";

dayjs.extend(relativeTime);

const Products = () => {
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        image: null,
        about: "",
        length: "",
        height: "",
        breadth: "",
        weight: "",
        active: false,
        attributes: [{key: "", value: ""}],
    });
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const {user} = useSelector((state) => state.user);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showCate, setShowCate] = useState(false);
    const [images, setImages] = useState([])
    const [singleFile, setSingleFile] = useState([]);

    const uploadSingleFiles = (e) => {
        // console.log('e.target.files ', e.target.files)
        if (e.target?.files?.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                //For Frontend
                const url = URL.createObjectURL(e.target.files[i])
                setSingleFile(prev => [...prev, url])

                //For Backend
                setImages(prev => [...prev, e.target.files[i]])
                console.log("SingleFileURLs 0", singleFile)
                console.log("Images 0", images)
            }
        }
    };

    const removeImage = (index) => {
        // console.log("remove");
        setSingleFile([
            ...singleFile.slice(0, index),
            ...singleFile.slice(index + 1, singleFile.length)
        ]);
        setImages(images.filter((image, ind) => index !== ind));
        // console.log("Images after removing image: ", images[0]);
    };

    const handleChange = (e) => {
        const {name, value, type, checked, files} = e.target;
        console.log("handleChange ", e.target)
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? files : value,
        }));
    };

    const handleAttributeChange = (index, field, value) => {
        const updated = [...form.attributes];
        updated[index][field] = value;
        setForm((prev) => ({...prev, attributes: updated}));
    };

    const addAttribute = (e) => {
        e.preventDefault();
        setForm((prev) => ({
            ...prev,
            attributes: [...prev.attributes, {key: "", value: ""}],
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Adding this Product in your Inventory',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("category", form.category);
            formData.append("price", form.price);
            formData.append("quantity", form.quantity);
            formData.append("active", form.active);
            formData.append("attributes", JSON.stringify(form.attributes));
            formData.append("about", form.about);
            formData.append("length", form.length);
            formData.append("height", form.height);
            formData.append("breadth", form.breadth);
            formData.append("weight", form.weight);
            if (images?.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    formData.append('image', images[i])
                    // console.log('From image ' ,form.image[i])
                    // console.log('Image ', images[i])
                }
            }
            // console.log('console form data after setting ', formData)

            const res = await axios.post("http://localhost:3000/api/product/createProduct", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });

            swal.close()

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
                attributes: [{key: "", value: ""}],
            });

            document.querySelector('#image').value = "";
        } catch (error) {
            swal.close();
            console.log("error: ", error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setShowAddProduct(!showAddProduct);
            swal.close()
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        const getAllProducts = async () => {
            Swal.fire({
                title: 'Fetching Products',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                const res = await axios.get("http://localhost:3000/api/product/getProducts", {
                    withCredentials: true
                });
                // console.log(res.data);
                setProducts(res.data.data);
                setLastUpdated(new Date());
                swal.close()
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
                const res = await axios.get("http://localhost:3000/api/product/getCategories", {
                    withCredentials: true
                });
                setCategories(res.data.categories);
                console.log("Fetched categories:", res.data.categories);
            } catch (e) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: e.response?.data?.message || 'Error ferching categories!',
                })
            }
        };

        getAllCategories();
        getAllProducts();
    }, []);


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
                            <RefreshCcw onClick={() => location.reload()}/> Last updated {dayjs(lastUpdated).fromNow()}
                        </p>
                    )}
                </div>
                <RightTopNav/>
            </div>
            <hr/>

            {/*add product form*/}
            <div className="mb-4">
                <div className="flex justify-end">
                    <button className="font-medium py-2 border-2 m-2 rounded-2xl border-black px-4 "
                            onClick={() => setShowAddProduct(!showAddProduct)}>Add Product
                    </button>

                    <button className="font-medium py-2 border-2 m-2 rounded-2xl border-black px-4 "
                            onClick={() => setShowCate(!showCate)}>Show Category Section
                    </button>
                </div>
                {showAddProduct ? <AddProduct
                    onSubmit={onSubmit}
                    addAttribute={addAttribute}
                    handleAttributeChange={handleAttributeChange}
                    handleChange={handleChange}
                    removeImage={removeImage}
                    uploadSingleFiles={uploadSingleFiles}
                    singleFile={singleFile}
                    categories={categories}
                    form={form}
                    setShowAddProduct={setShowAddProduct}
                    showAddProduct={showAddProduct}
                /> : null}
            </div>

            {/*Category Section */}
            {showCate ?
                <Categories/>
                : null
            }

            {/*Show Products*/}
            <ShowProducts
                filteredProducts={filteredProducts}
                products={products}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
        </>
    );
};

export default Products;
