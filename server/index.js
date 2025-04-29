require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {
    userRouter,
    productRouter,
    orderRouter,
    cartRouter,
    paymentRouter,
    logisticRouter,
    passwordRouter,
    uiCustomize,
    faq,
    newsletter
} = require('./routes/index')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT || 3002;


app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
    origin: 'https://ecommerce-tau-puce.vercel.app/', // your frontend origin
    credentials: true
}
));


mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Api routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)
app.use('/api/cart', cartRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/logistic', logisticRouter)
app.use('/api/password', passwordRouter)
app.use('/api/ui', uiCustomize)
app.use('/api/faq', faq)
app.use('/api/newsletter', newsletter)


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
