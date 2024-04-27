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
const PaymentTransModel = require("../models/transaction.model");
const Address = require("../models/address.model");
const router = Router();

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

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
          // console.log(paymentIntentPaymentFailed);

          await OrderModel.updateMany(
            { paymentTxnId: paymentIntentPaymentFailed.metadata.paymentTxnId },
            { $set: { paymentStatus: "Failed", orderStatus: "Rejected" } }
          );

          await PaymentTransModel.updateOne(
            { paymentTransactionID: paymentIntentPaymentFailed.id },
            {
              $set: {
                paymentStatus: "Failed",
              },
            }
          );

          break;

        case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data.object;

          await OrderModel.updateMany(
            { paymentTxnId: paymentIntentSucceeded.metadata.paymentTxnId },
            { $set: { paymentStatus: "Success", orderStatus: "On Progress" } }
          );

          await PaymentTransModel.updateOne(
            { paymentTransactionID: paymentIntentSucceeded.id },
            {
              $set: {
                paymentStatus: "Paid",
              },
            }
          );

          const user = await User.findById(
            paymentIntentSucceeded.metadata.user
          );

          const address = await Address.findById(
            paymentIntentSucceeded.metadata.address
          );

          const orderDetails = await PaymentTransModel.find({
            paymentIntentSucceeded.metadata.orderGroupID,
          }).populate("order");

          const date = new Date();

          const shiprocketOrder = {
            order_id: paymentIntentSucceeded.metadata.orderGroupID,
            order_date: date.toLocaleDateString(),
            pickup_location: "Primary",
            channel_id: process.env.SHIPROCKET_CHANNELID,

            billing_customer_name: user.name,
            billing_address: `${address.prefix}, ${address.streetName}, ${address.city}, ${address.state}, ${address.postalCode}`,
            billing_city: address.city,
            billing_pincode: address.postalCode,
            billing_state: address.state,
            billing_country: address.country,
            billing_email: user.email,
            billing_phone: user.mobileNo,
            shipping_is_billing: true,
            order_items: orderDetails.order.map((order_item) => ({
              name: order_item.title,
              sku: order_item.product,
              units: order_item.quantity,
              selling_price: order_item.price,
            })),
            payment_method: "Prepaid",
            sub_total: orderDetails.totalPrice,
            length: 10,
            breadth: 15,
            height: 20,
            weight: 2.5,
          };

          const shipRocketAuthToken = await shipRocketLogin();

          const response = await fetch(
            `https://apiv2.shiprocket.in/v1/external/orders/create/adhoc`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${shipRocketAuthToken}`,
              },
              body: JSON.stringify(shiprocketOrder),
            }
          );

          // const centerDetails = await User.findOne({
          //   center: paymentIntentSucceeded.metadata.center,
          // });

          await sendMail({
            from: `"Rent Karo" <${process.env.SENDER_EMAIL_ADDRESS}>`, // sender address
            // to: centerDetails.email, // list of receivers
            to: "nishalbarman+admin@gmail.com", // list of receivers
            // bcc: "nishalbarman@gmail.com", // can be the admin email address
            subject: "RentKaro: New Order Recieved", // Subject line
            html: `<html>
                    <body>
                      <div style="width: 100%; padding: 5px 0px; display: flex; justify-content: center; align-items: center; border-bottom: 1px solid rgb(0,0,0,0.3)">
                        <h2>Rent Karo</h2>
                      </div>
                      <div style="padding: 40px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;">
                        <center>
                          <span style="font-size: 18px;">Hey Yo Brother you just got a new order, You got a new order. Fullfill the order as soon as possible.
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
