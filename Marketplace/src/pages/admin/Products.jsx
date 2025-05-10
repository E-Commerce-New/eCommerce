import {RefreshCcw} from "lucide-react";
import {useEffect, useState, useRef} from "react";
import Swal from "sweetalert2";
import swal from "sweetalert2";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import RightTopNav from "../../components/reUsable/RightTopNav";
import Categories from "../../components/Categories";
import {useSelector} from "react-redux";
import CreateProducts from "./ProductModule/CreateProducts.jsx";
import ReadProducts from "./ProductModule/ReadProducts.jsx";
// import {z} from "zod";

dayjs.extend(relativeTime);

const Products = () => {
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const {user} = useSelector((state) => state.user);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showCate, setShowCate] = useState(false);

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
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/getProducts`, {
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
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/getCategories`, {
                    withCredentials: true
                });
                setCategories(res.data.categories);
                // console.log("Fetched categories:", res.data.categories);
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
                {showAddProduct ? <CreateProducts
                    categories={categories}
                    setShowAddProduct={setShowAddProduct}
                    showAddProduct={showAddProduct}
                    setProducts={setProducts}
                /> : null}
            </div>

            {/*Category Section */}
            {showCate ?
                <Categories/>
                : null
            }

            {/*Show Products*/}
            <ReadProducts
                // categories={categories}
                filteredProducts={filteredProducts}
                products={products}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setProducts={setProducts}
            />
        </>
    );
};

export default Products;
