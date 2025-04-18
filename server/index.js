require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const mongoose = require('mongoose');
const cors = require('cors');

// Import the User model
const User = require('./models/user');

// CORS setup
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Login or Registration route
app.post('/api/user/login', async (req, res) => {
    // console.log("Request body:", req.body);
    const { email, password } = req.body;

    try {
        // Create a new user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
          }
        if(user.password === password){
            res.status(200).json({ message: "User Logged In successfully...", user });

        }else{
            res.status(404).json({message:"User Not Found..."})
        }
    

    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
