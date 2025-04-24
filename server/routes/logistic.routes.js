const express = require('express');
const router = express.Router();
const {getPinCodeMapping, serviceability} = require('../helper/logisticHandelers');

router.get('/pincode/:pinCode', async (req, res) => {
    const {pinCode} = req.params;

    if (!pinCode) {
        return res.status(400).json({message: 'Please provide pincode'});
    }

    const result = await getPinCodeMapping(pinCode);

    if (result.success) {
        return res.status(200).json(result.data);
    } else {
        return res.status(result.status).json({error: result.message});
    }
});

router.post('/serviceability', async (req, res) => {
    const {pickUpPinCode, deliveryPinCode} = req.body;
    if (!pickUpPinCode || !deliveryPinCode) {
        return res.status(400).json({message: 'Please provide pincodes'});
    }
    const result = await serviceability(pickUpPinCode, deliveryPinCode);
    // console.log(result)
    if (result.success) {
        return res.status(200).json(result.data)
    } else {
        return res.status(result.status).json({error: result.error.statusText});
    }
})


module.exports = router;