import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, StarHalf } from "lucide-react";

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState({ avg: 0, count: 0, breakdown: {} });

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/reviews/getReviewsByProduct/${productId}`)
            .then(res => {
                const data = res.data;
                setReviews(data);
                const total = data.length;
                const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                let sum = 0;

                data.forEach(r => {
                    const rating = r.rating;
                    sum += rating;
                    breakdown[rating] = (breakdown[rating] || 0) + 1;
                });

                setSummary({
                    avg: (sum / total).toFixed(1),
                    count: total,
                    breakdown
                });
            })
            .catch(err => console.error("Failed to fetch reviews:", err));
    }, [productId]);

    if (!reviews.length) return null;

    const renderStars = (count) =>
        [...Array(5)].map((_, i) =>
            i < count ? <Star key={i} className="text-yellow-400 inline" /> : <StarHalf key={i} className="text-gray-300 inline" />
        );


    const maxReviews = Math.max(...Object.values(summary.breakdown));
    const getBarWidth = (rating) => `${(summary.breakdown[rating] / maxReviews) * 100}%`;

    return (
        <div className="p-6 mt-8 bg-white rounded-xl border shadow-sm">
            {/* Summary Section */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800">Customer Reviews</h3>
                <div className="flex items-center space-x-4 mt-2">
                    <span className="text-2xl font-bold text-yellow-500">{summary.avg} ★</span>
                    <span className="text-sm text-gray-600">{summary.count} reviews total</span>
                </div>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center mb-2">
                            <span className="text-sm text-gray-500">{star} Stars</span>
                            <div className="flex-1 ml-4 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-yellow-400 rounded-full h-full"
                                    style={{ width: getBarWidth(star) }}
                                ></div>
                            </div>
                            <span className="text-sm text-gray-500 ml-2">{summary.breakdown[star] || 0}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Review List */}
            <div className="space-y-4">
                {reviews.map((r, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-md border">
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center space-x-2">
                                {renderStars(r.rating)}
                                <span className="text-sm text-gray-700 font-medium">{r.user?.username || r.user?.name || "Anonymous"}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                                {new Date(r.createdAt).toDateString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700">{r.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReviews;
