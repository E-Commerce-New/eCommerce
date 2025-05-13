import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";
import addToCart from "../../components/reUsable/AddToCart";
import GoBack from "../../components/reUsable/Goback";
import ShowReviews from "./ShowReviews.jsx";

const fallbackImg = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";

const ProductInfo = () => {
    const {id} = useParams();
    const [product, setProduct] = useState({});
    const [mainImage, setMainImage] = useState("");
    const [zoomVisible, setZoomVisible] = useState(false);
    const [zoomStyles, setZoomStyles] = useState({});
    const imgRef = useRef(null);
    const {user} = useSelector((state) => state.user);
    const [purchaseInfo, setPurchaseInfo] = useState({});
    const [outOfStock, setOutOfStock] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState({
        charge: "", time: "",
    });
    console.log(user);
    const defaultAddress = user?.addresses?.find(address => address.isDefault === true);

    useEffect(() => {
        const fetchProductById = async () => {
            Swal.fire({
                title: 'Loading...', allowOutsideClick: false, allowEscapeKey: false, didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/getProductById`, {id}, {withCredentials: true});

                if (res.status === 200) {
                    const productData = res.data.data;
                    setProduct(productData);

                    if(productData.quantity < 1){
                        setOutOfStock(true)
                    }

                    if (productData?.images?.length > 0) {
                        setMainImage(`https://ik.imagekit.io/0Shivams${productData.images[0]}`);
                    }
                    Swal.close()
                    if (defaultAddress && productData?.weight) {
                        const deliveryRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/order/getCharges/${defaultAddress.postalCode}/${productData.weight}`);

                        if (deliveryRes.status === 200) {
                            const charge = deliveryRes?.data?.finalResult?.[0]?.freight_charge || 0;
                            const time = deliveryRes?.data?.finalResult[0]?.estimated_delivery_days || "N/A"
                            setDeliveryInfo({charge, time});
                        }
                    }
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                Swal.close();
            }
        };


        const fetchPurchaseInfo = async () => {
            try {
                const {data} = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/order/checkIfPurchased`, {
                    params: {
                        userId: user._id, productId: id,
                    }
                });
                console.table(data)
                setPurchaseInfo(data);
            } catch (err) {
                console.error("Error fetching purchase info", err);
            }
        }

        fetchProductById();
        fetchPurchaseInfo();


    }, [id]);

    const handleAddToCart = (productId) => {
        if (!user || !user._id) {
            let guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];

            const index = guestCart.findIndex((item) => item.productId === productId);
            if (index !== -1) {
                guestCart[index].quantity += 1;
            } else {
                guestCart.push({productId, quantity: 1});
            }

            localStorage.setItem('guest_cart', JSON.stringify(guestCart));

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'Saved temporarily in guest cart',
                text: 'Please login to save permanently',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });

            return;
        }

        // Logged-in users – call backend
        addToCart(productId, user._id);
    };

    const handleMouseMove = (e) => {
        const bounds = imgRef.current.getBoundingClientRect();
        const x = ((e.pageX - bounds.left) / bounds.width) * 100;
        const y = ((e.pageY - bounds.top) / bounds.height) * 100;
        setZoomStyles({
            backgroundPosition: `${x}% ${y}%`
        });
    };

    const inflatedPrice = Math.round(product.price * (100 / (100 - 60)));


    const handleAddReview = (productId, userId) => {
        Swal.fire({
            title: 'Write a Review', html: `
            <div style="width:100%; box-sizing: border-box; padding: 0 8px; overflow-x: hidden;">
  <label for="swal-input1" style="display:block; margin-bottom:6px; font-size:20px; color:#4B5563;">Rating (1-5)</label>
  <input id="swal-input1" type="number" min="1" max="5" placeholder="Enter rating"
         style="width:100%; padding:6px 10px; font-size:14px; border:1px solid #d1d5db; border-radius:4px; box-sizing:border-box;" />

  <label for="swal-input2" style="display:block; margin-top:16px; margin-bottom:6px; font-size:20px; color:#4B5563;">Your Review</label>
  <textarea id="swal-input2" rows="3" placeholder="Write something..."
            style="width:100%; padding:6px 10px; font-size:14px; border:1px solid #d1d5db; border-radius:4px; resize:none; box-sizing:border-box;"></textarea>
</div>


        `, focusConfirm: false, confirmButtonText: 'Submit Review', customClass: {
                popup: 'swal2-modern-review', confirmButton: 'bg-black text-white px-5 py-2 rounded hover:bg-gray-800'
            }, preConfirm: () => {
                const rating = parseInt(document.getElementById('swal-input1').value);
                const comment = document.getElementById('swal-input2').value.trim();

                if (!rating || rating < 1 || rating > 5) {
                    Swal.showValidationMessage("Rating must be between 1 and 5");
                    return false;
                }
                if (comment.length < 5) {
                    Swal.showValidationMessage("Review should be at least 5 characters long");
                    return false;
                }
                return {rating, comment};
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const {rating, comment} = result.value;
                axios.post(`${import.meta.env.VITE_BASE_URL}/api/reviews/createReview`, {
                    productId, userId, rating, comment
                })
                    .then(res => Swal.fire({
                        icon: 'success',
                        title: 'Review Added!',
                        text: res.data.message,
                        timer: 2000,
                        showConfirmButton: false
                    }))
                    .catch(err => Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: err.response?.data?.message || "Something went wrong. Try again.",
                        confirmButtonText: 'Okay'
                    }));
            }
        });
    };


    const handleReportProblem = async () => {
        const {value: message} = await Swal.fire({
            title: 'Report a Problem',
            input: 'textarea',
            inputLabel: 'What issue did you find?',
            inputPlaceholder: 'Describe the problem here...',
            inputAttributes: {
                'aria-label': 'Describe the problem here'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a message!';
                }
            }
        });

        if (message) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/report-product`, {
                    productId: product._id, userId: user?._id || null, message
                }, {withCredentials: true});

                if (res.status === 200) {
                    Swal.fire('Thanks!', 'Your report has been submitted.', 'success');
                }
            } catch (error) {
                Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
            }
        }
    };


    return (<div className="flex flex-col md:flex-row gap-8 p-4">
        {/* Image Section */}
        <div className="w-full md:w-1/3 relative">
            <div
                className="w-full h-96 border rounded-lg overflow-hidden relative"
                onMouseEnter={() => setZoomVisible(true)}
                onMouseLeave={() => setZoomVisible(false)}
                onMouseMove={handleMouseMove}
                ref={imgRef}
            >
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

            {/* Zoom View on Hover */}
            {zoomVisible && (<div
                className="hidden md:block absolute top-0 left-full ml-6 w-[150%] h-[100%] border shadow-xl rounded-lg z-50 bg-white"
                style={{
                    backgroundImage: `url(${mainImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "200%", ...zoomStyles
                }}
            />)}

            {/* Thumbnails */}
            <div className="flex gap-4 justify-center mt-4">
                {product?.images?.slice(0, 4).map((img, index) => {
                    const fullURL = `https://ik.imagekit.io/0Shivams${img}`;
                    return (<img
                        key={index}
                        src={fullURL}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-20 h-20 object-cover border-2 rounded-md cursor-pointer ${mainImage === fullURL ? "border-blue-500" : "border-gray-300"}`}
                        onClick={() => setMainImage(fullURL)}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = fallbackImg;
                        }}
                    />);
                })}
            </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-2/3 space-y-4">
            {purchaseInfo && purchaseInfo.purchased && purchaseInfo.purchaseDate && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>You purchased this on {new Date(purchaseInfo.purchaseDate).toLocaleDateString()}</span>
                </div>)}


            <div className="flex gap-2 items-center">
                <GoBack/>
                <h1 className="text-xl font-semibold">{product?.name} — <span
                    className="text-gray-600">{product?.description}</span></h1>
            </div>
            <hr/>
            <div className="space-y-1">
                <p className="text-red-500 font-bold">{60}% off</p>
                <p className="text-green-600 text-lg font-semibold">₹{product.price}</p>
                <p className="line-through text-gray-500 text-sm">M.R.P: ₹{inflatedPrice}</p>
                <p className="text-xs text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Attributes */}
            {product?.attributes?.length > 0 && (<div className="overflow-x-auto mt-6">
                <h2 className="text-lg font-semibold mb-2">Product Specifications</h2>
                <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-2">Attribute</th>
                        <th className="px-4 py-2">Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {product.attributes.map((attr, i) => (<tr key={i} className="even:bg-gray-50">
                        <td className="px-4 py-2 font-medium capitalize">{attr.key}</td>
                        <td className="px-4 py-2">{attr.value}</td>
                    </tr>))}
                    </tbody>
                </table>
            </div>)}


            {/* Description */}
            <div>
                <h2 className="font-medium text-lg mb-1">About this Item:</h2>
                <p className="text-sm text-gray-700">{product.description || "No description available."}</p>
            </div>

            {outOfStock ? null :
                <div>
                    <div className="font-bold">
                        Address for Delivery -{" "}
                        {defaultAddress
                            ? `${defaultAddress.addressLine1}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.postalCode}`
                            : "No default address available"}
                    </div>

                    <p className="text-sm text-gray-600">
                        This is your Default Address -
                        You can select the other addresses while buying through the cart.
                    </p>

                    <div className="font-bold mt-2">
                        Delivery Charge -{" "}
                        <span className="text-green-600 font-semibold">
                        ₹{deliveryInfo?.charge || 0}
                    </span>
                    </div>

                    <div className="font-bold">
                        Estimated Delivery Time -{" "}
                        <span className="text-green-600 font-semibold">
                        {deliveryInfo?.time || "Fetching"} Days
                    </span>
                    </div>
                </div>
            }


            <p className="font-bold text-red-700 text-2xl">{outOfStock ? "Out of Stock" : null}</p>
            {/* Actions */}
            <div className="flex gap-4">
                <button
                    disabled={outOfStock}
                    className={`bg-black text-white px-6 py-2 rounded hover:bg-gray-800 w-1/2 ${outOfStock ? "cursor-not-allowed" : null}`}
                    onClick={() => handleAddToCart(product._id)}
                >
                    Add to Cart
                </button>
            </div>

            <p
                onClick={handleReportProblem}
                className="underline cursor-pointer text-sm text-gray-600 hover:text-black"
            >
                Report a problem about this product
            </p>
            {purchaseInfo?.purchased === true && (<p onClick={() => handleAddReview(id, user._id)}
                                                     className="text-blue-600 cursor-pointer hover:underline">
                Add Review
            </p>)}

            <ShowReviews
                productId={id}
            />
        </div>
    </div>);
};

export default ProductInfo;
