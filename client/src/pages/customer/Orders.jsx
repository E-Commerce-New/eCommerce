import Goback from "../../components/reUsable/Goback.jsx";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ChevronDown, ChevronUp} from "lucide-react"
import Swal from "sweetalert2";

const Orders = () => {
    const {user} = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            Swal.fire({
                title: 'Loading your Orders...',
                text: 'Stay with us!',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                const res = await axios.post("http://localhost:3000/api/order/getOrdersById", user);
                if (res.status === 200) {
                    Swal.close()
                    const reversedata = res.data.reverse()
                    setOrders(reversedata);
                    console.log(res.data);
                }
            } catch (err) {
                Swal.close()
                console.log(err);
            }
        };
        if (user) fetchOrders();
        if (orders) orders.reverse()
    }, [user]);

    const navigate = useNavigate();

    const toggleOrderDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };


    return (
        <div
            className="p-4 w-[70%] mt-5 ml-[15%] h-[80vh] overflow-y-scroll scrollbar-hide border rounded-2xl bg-white shadow-2xl">
            <div className="pb-3 border-b-2 border-gray-200 flex justify-between">
                <div className="flex items-center gap-2">
                    <Goback/>
                    <h2 className="text-2xl font-bold">Your Orders</h2>
                </div>
                <div className="p-2"><strong>Total Orders :</strong> {orders.length}</div>
            </div>

            {/*Heading*/}
            <div className="flex gap-4 w-full mt-10 p-2 bg-gray-200 rounded-t-xl">
                <div className="flex gap-2 w-[30%]">
                    <p className="font-medium w-[15%]">S. NO</p>
                    <p className="font-medium w-[85%]">Order ID</p>
                </div>
                <p className="font-medium w-[20%]">Items Summary</p>
                <p className="font-medium w-[20%]">Payment Status</p>
                <p className="font-medium w-[20%]">Date & Time</p>
                <div className="flex items-center w-[10%]">
                    <p>Actions</p>
                </div>
            </div>

            {/*Show Orders*/}
            {orders.length === 0 ? (<p className="text-center text-red-500 font-medium">No orders
                found.</p>) : (orders.map((order, index) => {
                const dateString = order.createdAt;
                const date = new Date(dateString);
                const itemsSummary = `${order?.items?.length} items - ₹${order?.total}`;

                return (
                    <div key={order._id} className="border-b-2 pb-4 mb-4 border-black py-2">
                        <div className="flex justify-evenly items-center cursor-pointer hover:bg-green-200 py-2 px-2"
                             onClick={() => toggleOrderDetails(order._id)}>
                            {/* Order Row */}
                            <div className="flex gap-4 w-full justify-between">
                                <div className="flex gap-2 w-[30%]">
                                    <p className="font-medium w-[15%]">{index + 1}</p>
                                    <p className="font-medium w-[85%]">{order._id}</p>
                                </div>
                                <p className="font-medium w-[20%]">{itemsSummary}</p>
                                <p className="font-medium w-[20%]">{order.paymentStatus}</p>
                                <p className="font-medium w-[20%]">{date.toLocaleString()}</p>
                                <div className="flex items-center w-[10%]">
                                    {expandedOrderId === order._id ? (<ChevronUp className="ml-2"/>) : (
                                        <ChevronDown className="ml-2"/>)}
                                </div>
                            </div>
                        </div>
                        {/* Order Details (collapsed/expanded) */}
                        {expandedOrderId === order._id && (<div className="mt-4 pl-6">
                            <div>
                                <h4 className="font-semibold">Products - </h4>
                                {Array.isArray(order.items) && order.items.map((item, index) => (
                                    <div key={item._id}
                                         className="flex gap-2 cursor-pointer p-2 border-b-2 border-gray-200 hover:bg-gray-200 hover:rounded-2xl my-2 transition-all"
                                         onClick={() => navigate(`/product-info/${item._id}`)}
                                    >
                                        <p>{index + 1}</p>
                                        <p>{item.name} - ₹{item.price} × {item.quantity}</p>
                                    </div>))}
                            </div>
                            <div className="mt-2">
                                <p>
                                    <strong>Shipping:</strong> {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                </p>
                                {order.billingAddress && (<p>
                                    <strong>Billing:</strong> {order.billingAddress.addressLine1}, {order.billingAddress.city}, {order.billingAddress.postalCode}
                                </p>)}
                            </div>
                        </div>)}
                    </div>);
            }))}
        </div>
    );
};

export default Orders;
