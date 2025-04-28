const axios = require('axios');

const requiredBase = `Basic ${process.env.SR_BASE64}`;

const getPinCodeMapping = async (pinCode) => {
    try {
        const res = await axios.get(
            `https://sense.shiprocket.in/v1/pincodeMapping?pincode=${pinCode}`,
            {
                headers: {
                    'content-type': 'application/json',
                    'authorization': requiredBase
                }
            }
        );
        return {success: true, data: res.data};
    } catch (error) {
        return {
            success: false,
            status: error.response?.status || 500,
            message: error.response?.data?.message || error.message || 'Something went wrong',
        };
    }
};

const serviceability = async (pickUpPinCode, deliveryPinCode) => {
    try {
        const data = {
            "cod": 0,
            "shipment_value": 4999,
            "pickup_pincode": pickUpPinCode,
            "delivery_pincode": deliveryPinCode
        }
        const res = await axios.post("https://sense.shiprocket.in/v1/serviceability", data, {
            headers: {
                'content-type': 'application/json',
                'authorization': requiredBase
            }
        })
        return {success: true, data: res.data};
    } catch (error) {
        return {
            success: false,
            status: error.response?.status || 500,
            message: error.response?.data?.message || error.message || 'Something went wrong',
            error: error.response
        };
    }
}


module.exports = {
    getPinCodeMapping, serviceability
}