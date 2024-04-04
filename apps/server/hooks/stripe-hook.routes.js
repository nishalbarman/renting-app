const { Router } = require("express");
const OrderModel = require("../models/order.model");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  maxNetworkRetries: 3, // Retry a request twice before giving up
});
const express = require("express");
const router = Router();

const endpointSecret = "whsec_O3JO59y2d6GU3T73AkIkDf3OJ5zc3aj6";

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
        console.error(err)
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      switch (event.type) {
        case "payment_intent.payment_failed":
          const paymentIntentPaymentFailed = event.data.object;
          console.log(paymentIntentPaymentFailed);

          await OrderModel.updateMany({ paymentTxnId: paymentIntentSucceeded.metadata.paymentTxnId },
          {
            $set: { paymentStatus: "Failed", orderStatus: "Rejected" },
          });

          // Then define and call a function to handle the event payment_intent.payment_failed
          break;
        case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data.object;
          console.log(paymentIntentSucceeded);

          await OrderModel.updateMany({ paymentTxnId: paymentIntentSucceeded.metadata.paymentTxnId },
          {
            $set: { paymentStatus: "Success", orderStatus: "On Progress" },
          });
          // Then define and call a function to handle the event payment_intent.succeeded
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      

      // Return a 200 response to acknowledge receipt of the event
      return res.send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
