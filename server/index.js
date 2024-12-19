const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./src/routes/user.route');
const productRoutes = require('./src/routes/product.route');
const cartRoutes = require('./src/routes/cart.route');
const orderRoutes = require('./src/routes/order.route');
const reviewRoutes = require('./src/routes/review.route');
const adminRoutes = require('./src/routes/admin.route');
const paymentRoutes = require("./src/routes/payment.route");

//config 
const sessionStore = require('./src/config/session');

//middleware
const errorHandler = require('./src/middlewares/errorHandler');

//****************************** MIDDLEWARE ****************************** */
app.use(express.json()); 
app.use(cors({
    origin: process.env.CORS_ORIGIN.split(","), 
    credentials: true, 
}));
app.set("trust proxy", true);
app.use(sessionStore);

//routes
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/payment", paymentRoutes);

//error handling middleware
app.use(errorHandler);

//start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(5000, () => {
        console.log("Server is running on port 5000");
    });
}

module.exports = app;