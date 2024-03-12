const { Router } = require("express");
const { OrderModel } = require("../models/models");

const router = Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body.payload.entity);
    const { notes: transactionId } = req.body.payload.entity;
    await OrderModel.updateMany(
      { txnid: transactionId },
      {
        $set: { paymentStatus: true, orderStatus: "Placed" },
      }
    );

    console.log("\nNew order recieved with txn: " + transactionId + "\n");
    console.log("Details ------>", notes);

    res.status(200).json({ status: true, message: "Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
