import { useEffect, useState } from "react";
import { motion } from "framer-motion";
const reviews = [
    {
        id: 1,
        name: "John Doe",
        review: "Amazing quality! Customer service was super responsive. Highly recommended.",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
        id: 2,
        name: "Jane Smith",
        review: "Great product and fast delivery. Packaging could be improved.",
        rating: 4,
        imageUrl: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
        id: 3,
        name: "Sam Wilson",
        review: "Product was okay, but delivery was late.",
        rating: 3,
        imageUrl: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
        id: 4,
        name: "Lucy Grey",
        review: "I love the design and quality. Will buy again.",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
        id: 5,
        name: "Mike Brown",
        review: "Value for money. Would recommend!",
        rating: 4,
        imageUrl: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
        id: 6,
        name: "Emma White",
        review: "Excellent product, superb support!",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
        id: 7,
        name: "Chris Evans",
        review: "Good quality but took too long to arrive.",
        rating: 3,
        imageUrl: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    {
        id: 8,
        name: "Natalie Portman",
        review: "Looks amazing and works flawlessly.",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/women/5.jpg"
    },
    {
        id: 9,
        name: "Peter Parker",
        review: "Not happy with the build quality.",
        rating: 2,
        imageUrl: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    {
        id: 10,
        name: "Diana Prince",
        review: "Perfect product for the price. Must buy!",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/women/6.jpg"
    },
    {
        id: 11,
        name: "Tony Stark",
        review: "Top class service and support!",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/men/6.jpg"
    },
    {
        id: 12,
        name: "Bruce Wayne",
        review: "Premium product. Worth the money.",
        rating: 4,
        imageUrl: "https://randomuser.me/api/portraits/men/7.jpg"
    },
    {
        id: 13,
        name: "Selina Kyle",
        review: "Elegant packaging and good support.",
        rating: 4,
        imageUrl: "https://randomuser.me/api/portraits/women/7.jpg"
    },
    {
        id: 14,
        name: "Clark Kent",
        review: "Works well, satisfied with the performance.",
        rating: 4,
        imageUrl: "https://randomuser.me/api/portraits/men/8.jpg"
    },
    {
        id: 15,
        name: "Lois Lane",
        review: "Really happy with the purchase!",
        rating: 5,
        imageUrl: "https://randomuser.me/api/portraits/women/8.jpg"
    }
];
const reviewsData = reviews

const UserReviews = () => {
    const [displayedReviews, setDisplayedReviews] = useState([]);

    useEffect(() => {
        const shuffled = reviewsData.sort(() => 0.5 - Math.random());
        setDisplayedReviews(shuffled.slice(0, 3));
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Customer Reviews</h1>
            <div className="flex flex-col md:flex-row gap-4 overflow-x-auto md:overflow-x-visible">
                {displayedReviews.map((review) => (
                    <motion.div
                        key={review.id}
                        className="flex-shrink-0 md:flex-1 bg-white rounded-xl shadow-lg p-6 min-w-[300px]"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <img
                                src={review.imageUrl}
                                alt={review.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-lg font-semibold">{review.name}</h2>
                                <div className="flex">
                                    {Array.from({ length: review.rating }, (_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.341-.865 1.561-.865 1.902 0L12.62 7.176l4.47.327c.964.07 1.358 1.24.654 1.88l-3.24 2.83 1.007 4.356c.222.962-.8 1.688-1.642 1.175L10 15.347l-3.869 2.397c-.841.513-1.864-.213-1.642-1.175l1.007-4.356-3.24-2.83c-.704-.64-.31-1.81.654-1.88l4.47-.327L9.049 2.927z" />
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
