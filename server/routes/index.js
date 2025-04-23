const userRouter = require('./user.routes');
const productRouter = require('./product.routes');
const orderRouter = require('./order.routes');
const cartRouter = require('./cart.routes');
const paymentRouter = require('./payment.routes');

module.exports = {
    userRouter,
    productRouter,
    orderRouter,
    cartRouter,
    paymentRouter,
};