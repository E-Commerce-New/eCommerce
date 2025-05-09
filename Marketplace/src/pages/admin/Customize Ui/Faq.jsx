import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import swal from "sweetalert2";

const AddFaqForm = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [faqs, setFaqs] = useState([]);

    const handleDelete = async (faqId) => {
        Swal.fire({
            title: 'Deleting FAQ...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/faq/delete/${faqId}`);
            if(res.status === 200) {
                swal.close();
                swal.fire({
                    icon: "success",
                    title: "Success",
                    text : "Your faq has been deleted.",
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                })
            }
        } catch (error) {
            console.error("Failed to delete FAQ", error);
        }
    };

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/faq/`);
                setFaqs(res.data.faqs);
                console.log(res.data.faqs)
            } catch (error) {
                console.error(error);
            }
        };

        fetchFaqs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/faq/create`, {
                question,
                answer,
            });
            if (res.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "FAQ Added Successfully",
                    timer: 1500,
                });
                setQuestion("");
                setAnswer("");
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: "Unable to add FAQ",
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Add New FAQ</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2 font-semibold">Question</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Answer</label>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                        rows="4"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Save FAQ
                </button>
            </form>
            <div className="space-y-4 mt-5">
                {faqs.map((faq) => (
                    <div
                        key={faq._id}
                        className="p-4 border rounded shadow flex justify-between items-center"
                    >
                        <div>
                            <div className="font-bold">{faq.question}</div>
                            <div className="text-gray-600">{faq.answer}</div>
                        </div>
                        <button
                            onClick={() => handleDelete(faq._id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                        >
                           Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddFaqForm;
