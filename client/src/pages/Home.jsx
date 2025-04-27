import { useSelector } from 'react-redux'
import Products from "./customer/products.jsx"
import Carousel from "./customer/HomeSections/Carousel.jsx"
import MainProducts from "./customer/HomeSections/MainProducts.jsx"


const Home = () => {
    const { user } = useSelector((state) => state.user);

    return (
        <>
            {/* Hero Banner Section */}
            <Carousel />
            <MainProducts />
            {/* Other Sections */}
            <div className="space-y-4">
                <div className="bg-sky-200 p-4 rounded-lg">Promotional deals, seasonal offers, new arrivals</div>
                <div className="bg-sky-200 p-4 rounded-lg">Secondary Carousel will be here</div>
                <div className="bg-sky-200 p-4 rounded-lg">Main Product Categories</div>
                <div className="bg-sky-200 p-4 rounded-lg">Flash Deals / Limited Time Offers</div>
                <div className="bg-sky-200 p-4 rounded-lg">New Arrivals / Trending Now</div>
                <div className="bg-sky-200 p-4 rounded-lg">Recommended For You</div>
                <div className="bg-sky-200 p-4 rounded-lg">Top Rated Products</div>
                <div className="bg-sky-200 p-4 rounded-lg">User Reviews Section</div>
                <div className="bg-sky-200 p-4 rounded-lg">Newsletter Subscription</div>
                <div className="bg-sky-200 p-4 rounded-lg">Footer Section</div>
                <div className="bg-sky-200 p-4 rounded-lg">Floating Help or Chat Button</div>
            </div>

            {/* Products */}
            <div className="mt-10">
                <Products />
            </div>
        </>
    );
}

export default Home;
