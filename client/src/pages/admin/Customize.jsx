import Banner from "./Customize Ui/Banner.jsx"
import MainProducts from "./Customize Ui/MainProducts.jsx"

const Customize = () => {
    return (<>
            <div className="p-4 w-[70%] ml-[15%] h-[80vh] overflow-y-scroll scrollbar-hide
        border rounded-2xl bg-white
        shadow-2xl transform-gpu
        hover:scale-[1.02] hover:-rotate-x-1 hover:rotate-y-1
        transition-all duration-300 ease-in-out
        bg-white/30 backdrop-blur-md border-white/20"
            >
                <Banner/>
                <MainProducts/>
            </div>
        </>)
}

export default Customize;
