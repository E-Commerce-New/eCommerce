import {useEffect, useState} from "react";
import axios from "axios";

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/faq/`);
                setFaqs(res.data.faqs);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFaqs();
    }, []);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
            <div className="space-y-4">
                {faqs?.map((faq, index) => (
                    <div key={index} className="border-b pb-4">
                        <button
                            className="w-full flex justify-between items-center text-left font-medium text-xl"
                            onClick={() => toggleFAQ(index)}
                        >
                            {faq.question}
                            <span className="text-2xl">{openIndex === index ? "-" : "+"}</span>
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                openIndex === index ? "max-h-40" : "max-h-0"
                            }`}
                        >
                            <p className="mt-2 text-gray-600">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;
