require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/user.routes')
const productRouter = require('./routes/product.routes')

// Import the User model
const User = require('./models/user');

app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Api routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
