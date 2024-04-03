const { Router } = require("express");
const OrderModel = require("../models/order.model");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const router = Router();

const endpointSecret = "whsec_ycxMZCRx2pO8W07ugKHnW0LvHuRszFTB";

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("GOT AN REQUEST IN THE ENDPOINT-->");
    try {
      const sig = req.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data.object;
          console.log(paymentIntentSucceeded);
          break;
        case "payment_intent.payment_failed":
          const paymentIntentFailed = event.data.object;
          console.log(paymentIntentFailed);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      //   await OrderModel.updateMany(
      //     { txnid: transactionId },
      //     {
      //       $set: { paymentStatus: true, orderStatus: "Placed" },
      //     }
      //   );

      // Return a 200 response to acknowledge receipt of the event
      return res.send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;