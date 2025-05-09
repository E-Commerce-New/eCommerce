import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Banner from "./Customize Ui/Banner.jsx";
import MainProducts from "./Customize Ui/MainProducts.jsx";
import FAQ from "./Customize Ui/Faq.jsx";

const AdminSettings = () => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (sectionName) => {
        if (openSection === sectionName) {
            setOpenSection(null);
        } else {
            setOpenSection(sectionName);
        }
    };
    return (<>
        <div className="p-4 w-[70%] ml-[15%] h-[80vh] overflow-y-scroll scrollbar-hide
        border rounded-2xl bg-white
        shadow-2xl transform-gpu
        hover:scale-[1.02] hover:-rotate-x-1 hover:rotate-y-1
        transition-all duration-300 ease-in-out
        bg-white/30 backdrop-blur-md border-white/20"
        >
            <h1 className="p-2 text-2xl font-bold text-red-500">Customize UI</h1>
            <div className="mb-4">
                <h2
                    className="text-2xl font-bold cursor-pointer mb-2 border-b-2 pb-2"
                    onClick={() => toggleSection("banner")}
                >
                    Banner
                </h2>
                <AnimatePresence initial={false}>
                    {openSection === "banner" && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden"
                        >
                            <Banner />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* MainProducts Section */}
            <div className="mb-4">
                <h2
                    className="text-2xl font-bold cursor-pointer mb-2 border-b-2 pb-2"
                    onClick={() => toggleSection("products")}
                >
                    Main Products
                </h2>
                <AnimatePresence initial={false}>
                    {openSection === "products" && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden"
                        >
                            <MainProducts />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* FAQ Section */}
            <div className="mb-4">
                <h2
                    className="text-2xl font-bold cursor-pointer mb-2 border-b-2 pb-2"
                    onClick={() => toggleSection("faq")}
                >
                    FAQ
                </h2>
                <AnimatePresence initial={false}>
                    {openSection === "faq" && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden"
                        >
                            <FAQ />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </>)
}

export default AdminSettings;