const dotEnv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotEnv.config();
const dbConnect = require("./config/dbConfig");

dbConnect(); // connect to databse

const app = express();

const extractToken = async (req, res, next) => {
  try {
    console.log("Request found for router -->>", req.url);
    console.log("Request Method -->>", req.method);

    const publicRoute =
      req.url === "/" ||
      req.url === "/auth/login" ||
      req.url === "/auth/signup" ||
      req.url === "/auth/sendOtp" ||
      req.url === "/pay/razorpay/hook" ||
      req.url === "/get-image-bg-color";

    console.log("Is public router -->", publicRoute);

    if (publicRoute) {
      return next();
    }

    const authorization = req.headers["authorization"];
    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    req.jwt = { token: token };
    console.log(req.jwt);
    return next();
  } catch (error) {
    return res.status(403).json({ message: "No token provided" });
  }
};

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(extractToken);

app.use("/auth/login", require("./routes/users/login/login.routes"));
app.use("/auth/signup", require("./routes/users/signup/signup.routes"));
app.use("/auth/sendOtp", require("./routes/otpSend/mobile.routes"));
app.use("/category", require("./routes/categories/category.routes"));
app.use("/products", require("./routes/products/products.routes"));
app.use("/wishlist", require("./routes/wishlist/wishlist.routes"));
app.use("/cart", require("./routes/cart/cart.routes"));
app.use("/order", require("./routes/order/order.routes"));
app.use("/address", require("./routes/address/address.routes"));
app.use("/feedbacks", require("./routes/feedbacks/feedbacks.routes"));

app.use(
  "/pay/razorpay/create-cart-order",
  require("./routes/payment/razorpay/create-cart-order/razorpay.routes")
);
app.use("/pay/razorpay/hook", require("./hooks/hook.routes"));

app.use(
  "/get-image-bg-color",
  require("./routes/get-image-color/getImageColor.routes")
);

// app.use("/*", (_, res) => {
//   res.send({ message: "It's working nicely!" });
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App is running on http://192.168.227.210:${PORT}`);
});
