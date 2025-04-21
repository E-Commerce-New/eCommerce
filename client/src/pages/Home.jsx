import {useSelector, useDispatch} from 'react-redux'
import Products from "./customer/products.jsx"

const Home = () => {
    const { user } = useSelector((state) => state.user);
    console.log(user)
    return (
        <>
        <div className="bg-sky-200 p-2 m-2">Promotional deals , seasonal offers , new arrivals will be here</div>
        <div className="bg-sky-200 p-2 m-2">Carousel will be here</div>
        <div className="bg-sky-200 p-2 m-2">main products categories</div>
        <div className="bg-sky-200 p-2 m-2">flash deals/Limited time offers</div>
        <div className="bg-sky-200 p-2 m-2">New Arrivals / Trending Now</div>
        <div className="bg-sky-200 p-2 m-2">Recommended for you</div>
        <div className="bg-sky-200 p-2 m-2">Top Rated Products</div>
        <div className="bg-sky-200 p-2 m-2">User Reviews Section (dummy)</div>
        <div className="bg-sky-200 p-2 m-2">NewsLetter Subscription</div>
        <div className="bg-sky-200 p-2 m-2">footer</div>
        <div className="bg-sky-200 p-2 m-2">Floating Help or chat with us button</div>

            <div><Products/></div>
        </>
    )
}

export default Home