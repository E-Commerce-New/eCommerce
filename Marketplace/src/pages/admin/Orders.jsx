import {useEffect, useState} from "react";
import axios from "axios";
import {AnimatePresence, motion} from "framer-motion";
import {useNavigate} from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const FetchOrders = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/order/getOrders`);
                setOrders(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        FetchOrders();
    }, []);

    const toggleOrder = (id) => {
        setActiveOrder(prev => prev === id ? null : id);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">📦 Orders Overview</h2>
            {orders.length > 0 ? null :
                <p className="text-2xl text-red-500 font-bold text-center my-32">No Order Found till now!</p>}
            {orders.map((order, index) => {
                const total = order?.order_items?.reduce((acc, item) => acc + item.price * item.quantity, 0);
                return (
                    <div key={order._id} className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
                        {/* Overview Row */}
                        <div
                            className="cursor-pointer flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition-all"
                            onClick={() => toggleOrder(order._id)}
                        >
                            <p><strong>Order #{index + 1}</strong></p>
                            <p>{order?.items?.length} Products</p>
                            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>Total: ₹{total}</p>
                            <p className={order.paymentStatus === "Paid" ? "text-green-600" : "text-red-500"}>
                                {order.paymentStatus}
                            </p>
                        </div>

                        {/* Slide Down Details */}
                        <AnimatePresence>
                            {activeOrder === order._id && (
                                <motion.div
                                    initial={{height: 0, opacity: 0}}
                                    animate={{height: "auto", opacity: 1}}
                                    exit={{height: 0, opacity: 0}}
                                    transition={{duration: 0.3}}
                                    className="overflow-hidden bg-white"
                                >
                                    <div className="p-4">
                                        <p className="text-right">Order id - {order?._id}</p>
                                        {/* Addresses */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                            <div>
                                                <h3 className="font-semibold">Shipping Address</h3>
                                                <p>{order?.shippingAddress.addressLine1}, {order?.shippingAddress.addressLine2}</p>
                                                <p>{order?.shippingAddress.city}, {order?.shippingAddress.state}</p>
                                                <p>{order?.shippingAddress.postalCode}, {order?.shippingAddress.country}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Billing Address</h3>
                                                <p>{order?.billingAddress.addressLine1}, {order?.billingAddress.addressLine2}</p>
                                                <p>{order?.billingAddress.city}, {order?.billingAddress.state}</p>
                                                <p>{order?.billingAddress.postalCode}, {order?.billingAddress.country}</p>
                                            </div>
                                        </div>

                                        {/* Items Table */}
                                        <table className="w-full table-auto border-collapse border border-gray-300">
                                            <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-2 border">#</th>
                                                <th className="p-2 border text-left">Product Name</th>
                                                <th className="p-2 border">Price</th>
                                                <th className="p-2 border">Qty</th>
                                                <th className="p-2 border">Total</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {order?.order_items?.map((item, idx) => (
                                                <tr key={item._id}
                                                    onClick={() => navigate(`/product-info/${item._id}`)}
                                                >
                                                    <td className="p-2 border text-center">{idx + 1}</td>
                                                    <td className="p-2 border">{item.name}</td>
                                                    <td className="p-2 border text-center">₹{item.price}</td>
                                                    <td className="p-2 border text-center">{item.quantity}</td>
                                                    <td className="p-2 border text-center">₹{item.price * item.quantity}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>

                                        {/* Footer Info */}
                                        <div
                                            className="flex flex-col sm:flex-row justify-between text-sm text-gray-700 mt-4">
                                            <p><strong>Status:</strong> {order.status}</p>
                                            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                            <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

export default Orders;
