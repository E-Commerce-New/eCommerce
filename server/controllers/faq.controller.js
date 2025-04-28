const Faq = require('../models/faq');

const getAllFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find();
        res.status(200).json({faqs});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};

const createFaq = async (req, res) => {
    console.log(req.body);
    try {
        const {question, answer} = req.body;
        const newFaq = new Faq({question, answer});
        await newFaq.save();
        res.status(201).json({message: "FAQ created successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};


const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await Faq.findById(id);

        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        await Faq.findByIdAndDelete(id);
        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = {
    getAllFaqs,
    createFaq,
    deleteFaq
};
