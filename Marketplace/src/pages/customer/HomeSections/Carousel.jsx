import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';
import 'swiper/css';
import {useEffect, useState} from "react";
import axios from "axios";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const Carousel = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/ui/get`);
            if (res.data.success) {
                console.log(res.data.data.banners);
                setBanners(res.data.data.banners);
            }
        };
        fetchBanners();
    }, []);
    return (
        <>

            <div className="max-w-[90vw] mx-auto rounded-lg relative">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    navigation={true}
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="rounded-lg overflow-hidden"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner._id}>
                            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
                                <a href={banner.redirectUrl}>
                                    <img
                                        src={banner.imageUrl}
                                        alt="Banner"
                                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"

                                    />
                                </a>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>



        </>
    )
}

export default Carousel

