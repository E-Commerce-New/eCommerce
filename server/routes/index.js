const userRouter = require('./user.routes');
const productRouter = require('./product.routes');
const orderRouter = require('./order.routes');
const cartRouter = require('./cart.routes');
const paymentRouter = require('./payment.routes');
const logisticRouter = require('./logistic.routes')
const passwordRouter = require('./password.routes');
const uiCustomize = require('./uiCustomize.routes');
const faq = require('./faq.routes');
const newsletter = require('./newsletter.routes');
const reviewRoutes = require('./review.routes');
const saveForLater = require('./saveForLater.routes');
const authRouter =  require('./auth.routes');
module.exports = {
    userRouter,
    productRouter,
    orderRouter,
    cartRouter,
    paymentRouter,
    logisticRouter,
    passwordRouter,
    uiCustomize,
    faq,
    newsletter,
    reviewRoutes,
    saveForLater,
    authRouter
};