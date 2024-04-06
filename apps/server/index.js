const dotEnv = require("dotenv");
const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

dotEnv.config();
const dbConnect = require("./config/dbConfig");

dbConnect(); // connect to databse

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
  message: { message: "opps, getting to frequent request.. go slow" },
});

const app = express();

const extractToken = async (req, res, next) => {
  try {
    // console.log("Request found for router -->>", req.url);
    // console.log("Request Method -->>", req.method);

    const publicRoute =
      req.url === "/" ||
      req.url === "/helloworld" ||
      req.url === "/auth/login" ||
      req.url === "/auth/signup" ||
      req.url === "/auth/sendOtp" ||
      req.url === "/pay/razorpay/hook" ||
      req.url === "/stripe/hook" ||
      req.url === "/get-image-bg-color";

    // console.log("Is public router -->", publicRoute);

    if (publicRoute) {
      return next();
    }

    const authorization = req.headers["authorization"];
    console.log(authorization);
    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    req.jwt = { token: token };
    console.log(req?.jwt);
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "No token provided" });
  }
};

app.use(
  cors({
    origin: "*",
  })
);

// this route need raw json data so thats why placing it before experss.json()
app.use("/stripe/hook", require("./hooks/stripe-hook.routes"));

app.use(limiter);
app.use(express.json());
app.use(extractToken);

app.use("/user", require("./routes/users/user.routes"));
app.use("/auth/login", require("./routes/users/login.routes"));
app.use("/auth/signup", require("./routes/users/signup.routes"));
app.use("/auth/sendOtp", require("./routes/otpSend/mobile.routes"));
app.use("/categories", require("./routes/categories/category.routes"));
app.use("/products", require("./routes/products/products.routes"));
app.use("/wishlist", require("./routes/wishlist/wishlist.routes"));
app.use("/cart", require("./routes/cart/cart.routes"));
app.use("/address", require("./routes/address/address.routes"));
app.use("/feedbacks", require("./routes/feedbacks/feedbacks.routes"));
app.use("/orders", require("./routes/order/order.routes"));

app.use(
  "/pay/razorpay/create-cart-order",
  require("./routes/payment/razorpay/pay-cart.routes")
);
app.use("/pay/razorpay/hook", require("./hooks/hook.routes"));

// stripe payment gateway
app.use("/stripe/cart", require("./routes/payment/stripe/pay-cart.routes"));

app.use(
  "/get-image-bg-color",
  require("./routes/get-image-color/getImageColor.routes")
);

app.get("/helloworld", (_, res) => {
  res.send("Hello World!");
});

// app.use("/*", (_, res) => {
//   res.send({ message: "It's working nicely!" });
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
