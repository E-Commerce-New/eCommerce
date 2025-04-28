const mongoose = require("mongoose");
const Order = require("../models/order");
const User = require("../models/user");
const {sendOrderConfirmationEmail} = require("../utils/sendMail");
const {updateProductStock} = require("./product.controller");

const axios = require("axios");

const getValidDateAndTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return (`${year}-${month}-${day} ${hours}:${minutes}`);
}

const placeOrder = async (req, res) => {
    const {cartItems, shippingAddress, paymentInfo, totalPrice, userId} = req.body;
    console.log("Place Order", req.body);

    try {
        await updateProductStock(cartItems);


        const order = await Order.create({
            userId,
            status: "Processing",
            items: cartItems,
            shippingAddress,
            paymentMethod: "Razorpay",
            paymentStatus: "Paid",
            transactionId: paymentInfo?.razorpay_payment_id || "Pending",
            total: totalPrice,
            billingAddress: {
                addressLine1: "Sonia Vihar",
                addressLine2: "1st Pusta",
                city: "Delhi",
                state: "Delhi",
                postalCode: '110094',
                country: "India"
            },
        });

        console.log("Order Saved", order);
        // console.log(req.body.cartItems);
        const user = await User.findOne({_id: userId});

        for (let i = 0; i < cartItems.length; i++) {
            //     const dataAndTime = getValidDateAndTime();
            //     const data = await Order.create({
            //         userId: userId,
            //         status: "Processing",
            //         items: cartItems[i],
            //         shippingAddress,
            //         paymentMethod: paymentInfo?.method || "Unknown",
            //         paymentStatus: "Paid",
            //         transactionId: paymentInfo?.transactionId || "Pending",
            //         total: totalPrice,
            //         billingAddress: {
            //             addressLine1 : "Sonia Vihar",
            //             addressLine2 : "1st Pusta",
            //             city : "Delhi",
            //             state : "Delhi",
            //             postalCode : '110094',
            //             country: "India",
            //             userCart
            //         },
            //     })

            // console.log("Data " , data);
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
                payment_method: "Prepaid",
                shipping_charges: 0,
                giftwrap_charges: 0,
                transaction_charges: 0,
                total_discount: 0,
                sub_total: cartItems[i].price,
                length: cartItems[i].length,
                breadth: cartItems[i].breadth,
                height: cartItems[i].height,
                weight: cartItems[i].weight
            }
            // console.log("Data", data);

            const res = await axios.post("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", data, {
                headers: {
                    'content-type': 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjY0MDU5ODEsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzQ2NDI3OTYzLCJqdGkiOiJMSmw3eDJNbUJNNTV4VWpkIiwiaWF0IjoxNzQ1NTYzOTYzLCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTc0NTU2Mzk2MywiY2lkIjo2MTg2NzAwLCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.uGlIvFc-hFkb3Ikm_7jHXYvbrg2dwzZpbVZTHsYGies'
                }
            })

            console.log("Response", res);

            const order = await Order.create({
                userId: userId,
                order_id: res.data.order_id,
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
                        name: cartItems[i].name,
                        units: cartItems[i].quantity,
                        selling_price: cartItems[i].price,
                        sku: cartItems[i].name
                    }
                ],
                shippingAddress,
                paymentMethod: paymentInfo?.method || "Prepaid",
                paymentStatus: "Paid",
                transactionId: paymentInfo?.transactionId || "Pending",
                total: cartItems[i].price,
                billingAddress: {
                    addressLine1: "Sonia Vihar",
                    addressLine2: "1st Pusta",
                    city: "Delhi",
                    state: "Delhi",
                    postalCode: '110094',
                    country: "India"
                },
            });
            console.log(order)
        }


        await User.findByIdAndUpdate(userId, {cart: []});
        await sendOrderConfirmationEmail(process.env.Your_Email, order.toObject());

        // { order_id : number min-6 numbers,
        //     order_date:  string 2019-07-24 11:11,
        //     billing_customer_name: string,
        //     billling_address: string,
        //     billing_city: string,
        //     billing_pincode: integer,
        //     billing_state:string,
        //     billing_country:string,
        //     billing_email:string,
        //     billing_phone:integer 8368509006,
        //     shipping_is_billing:boolean,
        //     shipping_customer_name:(CONDITIONAL string( Required in case billing is not same as shipping.) and a few more if billing is not shipping),
        //     order_items:array(List of items and their relevant fields in the form of Array.),
        //     name:string(product name),
        //     sku : string(product sku),
        //     selling_price: integer(inclusive of GST),
        //     payent_method: stirng(cod or prepaid),
        //     sub_total: integer,
        //         length: float(in cm),
        //     bredth: float(in cm),
        //     height: flaot(in cm),
        //     weight: float( in kg)
        // }

        //
        //     "order_id": 818383995,
        //         "channel_order_id": "224-446",
        //         "shipment_id": 814768418,
        //         "status": "NEW",
        //         "status_code": 1,
        //         "onboarding_completed_now": 0,
        //         "awb_code": "",
        //         "courier_company_id": "",
        //         "courier_name": "",
        //         "new_channel": false,
        //         "packaging_box_error": ""
        // }

        res.status(200).json({success: true});
        res.status(200).json({success: true, order});

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

module.exports = {placeOrder, getOrdersById, getOrders, getTotalRevenue};
