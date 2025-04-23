import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";
import swal from "sweetalert2";

const ProductInfo = () => {
    const id = useParams();
    const [product, setProduct] = useState({});
    const [mainImage, setMainImage] = useState("");
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductById = async () => {
            Swal.fire({
                title: 'Loading...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const pid = id.id
            console.log(pid)
            try {
                const res = await axios.post(`http://localhost:3000/api/product/getProductById`, {id : pid}, {
                    withCredentials: true,
                });
                if (res.status === 200) {
                    const productData = res.data.data;
                    setProduct(productData);
                    if (productData?.images?.length > 0) {
                        setMainImage(`https://ik.imagekit.io/0Shivams${productData?.images?.[0]}`);
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                swal.close();
            }
        };
        fetchProductById();
    }, [id]);

    function handleAddToCart(productId, user) {
        if (!user || !user._id) {
            Swal.fire({
                title: 'You must be logged in!',
                text: 'Please login to add items to your cart.',
                icon: 'warning',
                confirmButtonText: 'Login now',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }
        navigate(`/add-to-cart/${productId}/${user._id}`);
    }


    const fallbackImg = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";

    const originalPrice = product?.price;
    const discountPercent = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
    const inflatedPrice = Math.round(originalPrice * (100 / (100 - discountPercent)));

    return (
        <>
            <div className="flex justify-start">

                {/*image section*/}
                <div className="w-[30%] justify-start">
                    <div className="flex flex-col w-full max-w-[600px] mx-auto mt-8">
                        {/* Main Image */}
                        <div className="w-full h-96 mb-4 border rounded-lg overflow-hidden">
                            <img
                                src={mainImage || fallbackImg}
                                alt={product?.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = fallbackImg;
                                }}
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 justify-center">
                            {product?.images?.slice(0, 4).map((img, index) => (
                                <img
                                    key={index}
                                    src={`https://ik.imagekit.io/0Shivams${img}`}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-20 h-20 object-cover border-2 rounded-md cursor-pointer ${mainImage.includes(img) ? "border-blue-500" : "border-gray-300"}`}
                                    onClick={() => setMainImage(`https://ik.imagekit.io/0Shivams${img}`)}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = fallbackImg;
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>


                {/*product info section */}
                <div className="flex flex-col gap-3 p-4 w-[70%]">
                    <h1>{product?.name} — {product?.description}</h1>
                    <hr/>
                    <p className="flex gap-3 items-center"><span className="text-sm text-red-500 font-medium">{discountPercent}%</span> <span className="text-green-600 font-semibold">₹{originalPrice}</span></p>
                    <p className="line-through text-gray-500 mr-2" >M.R.P: {inflatedPrice}</p>
                    <p>Inclusive of all taxes</p>
                    <div className="w-1/2">
                        {product?.attributes?.map((attribute, index) => {
                            return (
                                <div className="flex gap-2 my-3 w-full justify-between items-center capitalize">
                                    <p className="py-1 w-1/2 font-medium">{attribute.key}</p> -
                                    <p className="py-1 w-1/2">{attribute.value}</p>
                                </div>
                            )
                            }
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-medium">About this Item :- </h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab adipisci aliquid beatae consequatur ea eius error in laborum magni maiores maxime minima molestiae, mollitia neque perferendis, perspiciatis, provident quae quibusdam quisquam recusandae sed tempore temporibus veritatis voluptatum. Ad animi asperiores enim eveniet, fugiat iusto laborum provident quaerat quam quasi sequi sunt ullam ut voluptas voluptate. A accusantium assumenda consectetur distinctio dolores, eligendi ex illum in iste natus nulla, perferendis quas repudiandae sequi ullam ut, vel voluptates? Accusamus corporis dicta error iure iusto quaerat quibusdam quidem quisquam repudiandae soluta? Animi consequuntur doloremque dolorum est fugit maxime nam porro voluptate voluptatem?</p>
                    </div>
                    <p className="underline">Report a problem about this product</p>
                    <div className="flex gap-4 justify-end">
                        <button className="border-b-2 border-black p-2 w-1/2 hover:bg-gray-200"
                                onClick={()=>handleAddToCart(product._id , user)}
                        >Add to Cart</button>
                        {/*<button className="border-b-2 border-black p-2 w-1/2 hover:bg-gray-200">Buy Now</button>*/}
                    </div>
                    <hr/>

                </div>
            </div>
        </>
    )
}

export default ProductInfo;