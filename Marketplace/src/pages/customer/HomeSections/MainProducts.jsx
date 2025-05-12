import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay} from 'swiper/modules';
import 'swiper/css';
import {useEffect, useState} from "react";
import axios from "axios";
import 'swiper/css/scrollbar';
import {useNavigate} from "react-router-dom";

const MainProducts = () => {
    const [mainProducts, setMainProducts] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMainProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/ui/get`);
                const productIds = res?.data?.data?.mainProducts || [];

                if (res.status === 200 && Array.isArray(productIds)) {
                    const productRequests = productIds.map((id) =>
                        axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/getProductById`, { id })
                    );

                    const productResponses = await Promise.all(productRequests);
                    const products = productResponses.map(response => response.data.data);

                    setMainProducts(products);
                    console.log("Final products:", products);
                } else {
                    console.warn("Condition failed: mainProducts not an array or bad status");
                }
            } catch (err) {
                console.error("Error fetching main products:", err);
            }
        };

        fetchMainProducts();
    }, []);




    return (<>
        <div className="max-w-[90vw] mx-auto rounded-lg relative">
            <Swiper
                modules={[Autoplay]}
                pagination={{
                    clickable: true, dynamicBullets: true,
                }}
                navigation={true}
                spaceBetween={30}
                slidesPerView={5}
                loop={true}
                autoplay={{delay: 3000, disableOnInteraction: false}}
                className="rounded-lg overflow-hidden"
            >
                {mainProducts?.map((product) => (<SwiperSlide key={product._id}>
                    <div className="flex justify-center flex-col items-center overflow-hidden relative"
                         onClick={() => navigate(`/product-info/${product._id}`)}
                    >
                        <div className="overflow-hidden">
                            <img
                                src={`https://ik.imagekit.io/0Shivams${product.images?.[0] || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png"}`}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";
                                }}
                                className="h-full object-contain transition-transform duration-300 transform hover:scale-105"
                            />
                        </div>
                        <h1 className="p-3">{product.name}</h1>
                    </div>

                </SwiperSlide>))}
            </Swiper>
        </div>
    </>)
}

export default MainProducts;