require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {userRouter, productRouter, orderRouter} = require('./routes/index')
const cookieParser = require('cookie-parser')
// const ImageKit = require('imagekit')

const app = express()
const port = process.env.PORT || 3002;

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // your frontend origin
    credentials: true
}));

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Api routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)

// //ImageKit
//
// const imagekit = new ImageKit({
//     urlEndpoint: '',
//     publicKey: '',
//     privateKey: ''
// });
//
// app.get('/auth', async(req,res)=>{
//     const result = imagekit.getAuthenticationParameters();
//     res.send(result);
// })

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
