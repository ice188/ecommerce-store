const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. create payment intent
router.post(
  "/create-payment-intent",
  asyncHandler(async (req, res) => {
  
    const { amount, currency } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    
    res.json({
      message: "Payment intent created successfully",
      clientSecret: paymentIntent.client_secret,
    });
  })
);

module.exports = router;