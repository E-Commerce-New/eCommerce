import Products from "./customer/products.jsx"
import Carousel from "./customer/HomeSections/Carousel.jsx"
import MainProducts from "./customer/HomeSections/MainProducts.jsx"
import FAQ from "./customer/HomeSections/FAQ.jsx"
import Newsletter from "./customer/HomeSections/Newsletter.jsx"
import UserReviews from "./customer/HomeSections/UserReviews.jsx"
import ShowCategory from "./customer/HomeSections/ShopByCategory.jsx"
import SearchBar from "./customer/HomeSections/SearchBar.jsx"


const Home = () => {
    return (
        <>
            <SearchBar />
            <ShowCategory />
            <Carousel />
            <h1 className="text-2xl mx-6 py-2 px-2 border-b-2 mb-4 border-black font-bold">Trending Products</h1>
            <MainProducts />
            <h1 className="text-2xl mx-6 py-2 px-2 border-b-2 mb-4 border-black font-bold">Explore Products</h1>
            <Products />
            <UserReviews />
            <Newsletter />
            <FAQ />
        </>
    );
}

export default Home;
