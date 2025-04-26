import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';
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
            const res = await axios.get("http://localhost:3000/api/ui/get");
            if (res.data.success) {
                setBanners(res.data.banners);
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
                            <div className="flex justify-center items-center h-[500px] overflow-hidden relative">
                                <a href={banner.redirectUrl}>
                                    <img
                                        src={banner.imageUrl}
                                        alt="Banner"
                                        className="w-auto h-[400px] object-contain mx-auto my-0"
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

