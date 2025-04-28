const Newsletter = require('../models/Newsletter');

const subscribeNewsletter = async (req, res) => {
    try {
        const {email} = req.body;

        const existing = await Newsletter.findOne({email});
        if (existing) {
            return res.status(400).json({message: 'Email already subscribed!'});
        }

        const newSub = new Newsletter({email});
        await newSub.save();

        res.status(201).json({message: 'Subscribed successfully!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({subscribedAt: -1});
        res.status(200).json(subscribers);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

module.exports = {
    subscribeNewsletter,
    getAllSubscribers,
};
