const { Router } = require("express");
const OrderModel = require("../models/order.model");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  maxNetworkRetries: 3, // Retry a request twice before giving up
});
const express = require("express");
const User = require("../models/user.model");
const { sendMail } = require("../helpter/sendEmail");
const Cart = require("../models/cart.model");
const { default: mongoose } = require("mongoose");
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
        console.error(err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      switch (event.type) {
        case "payment_intent.payment_failed":
          const paymentIntentPaymentFailed = event.data.object;
          console.log(paymentIntentPaymentFailed);

          await OrderModel.updateMany(
            { paymentTxnId: paymentIntentPaymentFailed.metadata.paymentTxnId },
            { $set: { paymentStatus: "Failed", orderStatus: "Rejected" } }
          );
          break;

        case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data.object;
          console.log(paymentIntentSucceeded);

          await OrderModel.updateMany(
            { paymentTxnId: paymentIntentSucceeded.metadata.paymentTxnId },
            { $set: { paymentStatus: "Success", orderStatus: "On Progress" } }
          );

          const idsToDeleteAsObjectId =
            paymentIntentSucceeded.metadata.cartProductIds
              .split(",")
              .map((id) => new mongoose.Types.ObjectId(id));
          console.log("Cart ID'S --->", idsToDeleteAsObjectId);

          await Cart.deleteMany({
            _id: {
              $in: idsToDeleteAsObjectId,
            },
          });

          console.log("Center ID", paymentIntentSucceeded.metadata.center);
          console.log("Type of Center ID", typeof paymentIntentSucceeded.metadata.center);

          const centerDetails = await User.findOne({
            center: paymentIntentSucceeded.metadata.center,
          });

          await sendMail({
            from: `"Rent Karo" <${process.env.SENDER_EMAIL_ADDRESS}>`, // sender address
            to: centerDetails.email, // list of receivers
            bcc: "nishalbarman@gmail.com", // can be the admin email address
            subject: "RentKaro: New Order Recieved", // Subject line
            html: `<html>
                    <body>
                      <div style="width: 100%; padding: 5px 0px; display: flex; justify-content: center; align-items: center; border-bottom: 1px solid rgb(0,0,0,0.3)">
                        <h2>Rent Karo</h2>
                      </div>
                      <div style="padding: 40px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;">
                        <center>
                          <span style="font-size: 18px;">Hey, You got a new order. Fullfill the order as soon as possible.
                        </center>
                      </div>
                    </body>
                  </html>`, // html body
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
