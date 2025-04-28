import {useState} from "react";
import { motion } from "framer-motion";

const UserReviews = () => {
    const [reviews] = useState([
        {
            id: 1,
            name: "John Doe",
            review: "The products are absolutely amazing! I had such a great experience with this store. The customer service was extremely helpful and quick to respond to my queries. Highly recommend!",
            rating: 5,
            imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            id: 2,
            name: "Jane Smith",
            review: "This is my second time ordering, and I'm even more impressed than the first. Fast delivery, great product quality, and the packaging was perfect. Definitely coming back for more!",
            rating: 4,
            imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
            id: 3,
            name: "Sam Wilson",
            review: "The product quality is top-notch, but I was a bit disappointed with the packaging. The box was a little bent, but thankfully nothing inside was damaged. Still a good experience overall.",
            rating: 3,
            imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
        },
        {
            id: 4,
            name: "Lucy Grey",
            review: "Such a great variety of products! I found exactly what I needed and received it in just a couple of days. The customer support was also incredibly friendly and helpful. Will definitely shop here again!",
            rating: 5,
            imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
        }
    ]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Customer Reviews</h1>
            <div className="flex flex-col gap-6">
                {reviews.map((review) => (
                    <motion.div
                        key={review.id}
                        className="p-4 bg-white rounded-lg shadow-md"
                        initial={{opacity: 0, y: 50}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <img
                                src={review.imageUrl}
                                alt={review.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-xl font-semibold">{review.name}</h2>
                                <div className="flex">
                                    {Array.from({length: review.rating}, (_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor"
                                             viewBox="0 0 20 20">
                                            <path
                                                d="M9.049 2.927C9.39 2.062 10.61 2.062 10.951 2.927L12.62 7.176l4.47.327c.964.07 1.358 1.24.654 1.88l-3.24 2.83 1.007 4.356c.222.962-.8 1.688-1.642 1.175L10 15.347l-3.869 2.397c-.841.513-1.864-.213-1.642-1.175l1.007-4.356-3.24-2.83c-.704-.64-.31-1.81.654-1.88l4.47-.327L9.049 2.927z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">{review.review}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UserReviews;
