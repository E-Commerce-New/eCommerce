const mongoose = require("mongoose");
const Order = require("../models/order");
const User = require("../models/user");
const {sendOrderConfirmationEmail} = require("../utils/sendMail");
const {updateProductStock} = require("./product.controller");
const axios = require("axios");


//401 = token unauthorized
//422 = invalid data passed to api
//200 = all good

const getValidDateAndTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return (`${year}-${month}-${day} ${hours}:${minutes}`);
}

let token = process.env.SHIPROCKET_TOKEN || "token";

const getNewShipRocketToken = async () => {
    try {
        // console.log("Inside Get New ShipRocket Token")
        const data = {
            "email": process.env.SR_APIUSER_EMAIL,
            "password": process.env.SR_APIUSER_PASSWORD,
        }
        const res = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", data, {
                headers: {
                    'content-type': 'application/json'
                }
            }
        )
        console.log("Response token : ", res.data);
        token = res.data.token;
        return token
    } catch (err) {
        console.log("GetNewShiprocketToken Error:")
        console.log(err);
    }
}

const getCourierServiceAbility = async (data) => {
    try {
        // console.log("Inside Get Courier Service Ability and Data is ", data)
        const result = await axios.get("https://apiv2.shiprocket.in/v1/external/courier/serviceability/",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }, data
            }
        );
        // console.log("Result : ", result.data);
        return result;

    } catch (err) {
        console.log("GetCourierServiceAbility Error:")
        console.log(err)
        if(err.status ===422){console.log("Inside error");throw new Error(err)}
        await getNewShipRocketToken();
        return await getCourierServiceAbility(data);
    }
}

const placeOrderOnShipRocket = async (data) => {
    try {
        const result = await axios.post("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", data, {
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return result;
    } catch (err) {
        console.log("PlaceOrderOnShipRocket Error:")
        console.log(err);
        if(err.status ===422){console.log("Inside error");throw new Error(err)}
        await getNewShipRocketToken();
        return await placeOrderOnShipRocket(data);
    }
}

const cancelOrderOnShipRocket = async (data) => {
    try {
        const result = await axios.post("https://apiv2.shiprocket.in/v1/external/orders/cancel", data, {
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return result;
    } catch (err) {
        console.log("CancelOrderOnShipRocket Error:");
        console.log(err);
        if(err.status ===422){console.log("Inside error");throw new Error(err)}
        await getNewShipRocketToken();
        return await cancelOrderOnShipRocket(data);
    }
}

const placeOrder = async (req, res) => {
    const {cartItems, shippingAddress, paymentInfo, userId, userCart, paymentMethod, deliveryCharge} = req.body;
    // console.log("Place Order", req.body);

    try {
        const user = await User.findOne({_id: userId});

        for (let i = 0; i < cartItems.length; i++) {

            const data = {
                order_id: userCart[0]._id,
                order_date: getValidDateAndTime(),
                billing_customer_name: user.firstname,
                billing_last_name: user.lastname,
                billing_address: shippingAddress.addressLine1,
                billing_city: shippingAddress.city,
                billing_pincode: Number(shippingAddress.postalCode),
                billing_state: shippingAddress.state,
                billing_country: "India",
                billing_email: user.email,
                billing_phone: Number(user.phone),
                shipping_is_billing: true,
                order_items: [
                    {
                        name: cartItems[i].name,
                        units: cartItems[i].quantity,
                        selling_price: cartItems[i].price,
                        sku: cartItems[i].name
                    }
                ],
                payment_method: paymentMethod,
                shipping_charges: 0,
                giftwrap_charges: 0,
                transaction_charges: 0,
                total_discount: 0,
                sub_total: (cartItems[i].price * cartItems[i].quantity) + deliveryCharge[i],
                length: cartItems[i].length,
                breadth: cartItems[i].breadth,
                height: cartItems[i].height,
                weight: cartItems[i].weight
            }
            // console.log("Data", data);

            let res = await placeOrderOnShipRocket(data);

            // console.log("Response : ", res.status);
            if (res.data.order_id) {
                await Order.create({
                    userId: userId,
                    order_id: res.data.order_id,
                    channel_order_id: res.data.channel_order_id,
                    shipment_id: res.data.shipment_id,
                    status: res.data.status,
                    status_code: res.data.status_code,
                    onboarding_completed_Now: res.data.onboarding_completed_now,
                    awb_code: res.data.awb_code,
                    courier_company_id: res.data.courier_company_id,
                    new_channel: res.data.new_channel,
                    packaging_box_error: res.data.packaging_box_error,
                    order_items: [
                        {
                            _id: userCart[i].productId,
                            name: cartItems[i].name,
                            price: cartItems[i].price,
                            quantity: cartItems[i].quantity,
                            selling_price: cartItems[i].price,
                            sku: cartItems[i].name
                        }
                    ],
                    paymentMethod: paymentInfo?.method || paymentMethod || "Unknown",
                    paymentStatus: paymentMethod === "Prepaid" ? "Paid" : "Pending",
                    transactionId: paymentInfo?.transactionId || "Pending",
                    total: cartItems[i].price * cartItems[i].quantity,
                    shippingAddress,
                    billingAddress: {
                        addressLine1: "Sonia Vihar",
                        addressLine2: "1st Pusta",
                        city: "Delhi",
                        state: "Delhi",
                        postalCode: '110094',
                        country: "India"
                    },
                    deliveryCharges: deliveryCharge[i]
                });
                // console.log('shipment_id:,', res.data.shipment_id, "OrderID: ", userCart[0]._id)
            }

        }

        await updateProductStock(cartItems);
        await User.findByIdAndUpdate(userId, {cart: []});

        // await sendOrderConfirmationEmail(process.env.Your_Email, order.toObject());

        res.status(200).json({success: true, message: "Order Placed Successfully"});

        // res.status(200).json({ success: true, order });

    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({success: false, message: err.message});
    }
};

const getOrdersById = async (req, res) => {
    try {
        const userId = req.body._id;

        if (!userId) {
            return res.status(400).json({message: "User ID is required"});
        }

        const orders = await Order.find({userId: userId});

        if (!orders.length) {
            return res.status(404).json({message: "No orders found for this user"});
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

const getOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(200).json(orders);
}

const getTotalRevenue = async (req, res) => {
    try {
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
        res.json({revenue: totalRevenue});
    } catch (err) {
        res.status(500).json({message: 'Error calculating revenue'});
    }
};

const cancelOrderByOrderId = async (req, res) => {
    // console.log("Cancel Order", req.body);
    // Cancel Order { orderId: 820076213, documentId: '680e0e79490876cc145fcaef' }
    try {
        // console.log("Response : ", result.data);
        const data = {
            "ids": [req.body.orderId],
            "status": "cancelled"
        }
        const result = await cancelOrderOnShipRocket(data)
        // console.log("Result : ", result);
        if(result.status === 200) {
            await Order.findByIdAndDelete(req.body.documentId)

            //Setting Status to cancelled
            // await Order.findByIdAndUpdate(req.body.documentId, {status: "CANCELLED"})
        }
        res.status(200).json({success: true, message: "Order Cancelled Successfully"});
    } catch (err) {
        console.log("Error cancelling order: ");
        console.log(err);
        res.status(500).json({success: false, message: "Error cancelling order"});
    }
}

const getDeliveryCharges = async (req, res) => {
    const {topincode, weight} = req.params;
    // console.log("Pincode: ", topincode);
    const data = {
        pickup_postcode: "110090",
        delivery_postcode: topincode,
        "weight": weight,
        "cod": 0
    }
    // console.log(data)
    try {
        let result = await getCourierServiceAbility(data);
        // console.log("GetDDeliveryCharges: ", result)
        const finalResult = result.data.data.available_courier_companies.filter(item => {
            if (item.courier_company_id === 217) {
                return item
            }
        })
        res.status(200).json({finalResult});
    } catch (err) {
        console.log("GetDDeliveryCharges Error: ")
        console.log(err)
        res.status(500).json({success: false, message: "Error Getting Delivery Charges"});
    }

}


const checkIfPurchased = async (req, res) => {
    const { userId, productId } = req.query;

    if (!userId || !productId) {
        return res.status(400).json({ error: 'Missing userId or productId' });
    }

    try {
        const order = await Order.findOne({
            userId,
            order_items: {
                $elemMatch: {
                    _id: new mongoose.Types.ObjectId(productId)
                }
            }
        }).sort({ createdAt: -1 });

        if (!order) {
            return res.json({ purchased: false });
        }

        return res.json({
            purchased: true,
            purchaseDate: order.createdAt
        });
    } catch (err) {
        console.error("Error checking purchase status:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {placeOrder, getOrdersById, getOrders, getTotalRevenue, cancelOrderByOrderId, getDeliveryCharges , checkIfPurchased};