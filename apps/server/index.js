const dotEnv = require("dotenv");
const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

dotEnv.config();
const dbConnect = require("./config/dbConfig");
const sendEmail = require("./helpter/sendEmail");

dbConnect(); // connect to databse

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 3600, // Limit each IP to 3600 requests per `window` (here, per 1 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
  message: { message: "opps, getting to frequent request.. go slow" },
});

// sendEmail({
//   from: '"RentKaro" <nishalexperiments@gmail.com>', // sender address
//   to: "nishalbarman@gmail.com", // list of receivers
//   bcc: "nishalbarmann@gmail.com",
//   subject: "RentKaro: New Order Recieved", // Subject line
//   html: `<html>
//           <body>
//             <div style="width: 100%; padding: 5px 0px; display: flex; justify-content: center; align-items: center; border-bottom: 1px solid rgb(0,0,0,0.3)">
//               <h2>Rent Karo</h2>
//             </div>
//             <div style="padding: 40px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;">
//               <center>
//                 <span style="font-size: 18px;">Hey, You got a new order. Fullfill the order as soon as possible.
//               </center>
//             </div>
//           </body>
//         </html>`, // html body
// });

const app = express();

const extractToken = async (req, res, next) => {
  try {
    // console.log("Request found for router -->>", req.url);
    // console.log("Request Method -->>", req.method);

    const publicRoute =
      req.url === "/" ||
      req.url === "/helloworld" ||
      req.url === "/auth/admin-login" ||
      req.url === "/auth/login" ||
      req.url === "/auth/signup" ||
      req.url === "/auth/sendOtp" ||
      req.url === "/pay/razorpay/hook" ||
      req.url === "/stripe/hook" ||
      req.url === "/get-image-bg-color" ||
      req.url === "/categories/view/:categoryId" ||
      req.url === "/orders/get-order-chart-data";

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
app.use(express.json({ limit: "50mb" }));

app.use(extractToken);

app.use("/user", require("./routes/users/user.routes"));
app.use("/auth", require("./routes/auth/authentication.routes"));
app.use("/auth/signup", require("./routes/auth/authentication.routes"));
app.use("/auth/sendOtp", require("./routes/otpSend/mobile.routes"));
app.use("/categories", require("./routes/categories/category.routes"));
app.use("/products", require("./routes/products/products.routes"));
app.use("/wishlist", require("./routes/wishlist/wishlist.routes"));
app.use("/cart", require("./routes/cart/cart.routes"));
app.use("/address", require("./routes/address/address.routes"));
app.use("/feedbacks", require("./routes/feedbacks/feedbacks.routes"));
app.use("/orders", require("./routes/order/order.routes"));

// center related routes
app.use("/center", require("./routes/centers/center.routes"));

// payment hooks
app.use("/pay/razorpay/cart", require("./routes/payment/razorpay/cart.routes"));
app.use("/pay/razorpay/hook", require("./hooks/hook.routes"));

// stripe payment gateway
app.use("/stripe/cart", require("./routes/payment/stripe/pay-cart.routes"));
app.use("/payment/summary", require("./routes/payment/summary.routes"));

//shiprocket
app.use("/shiprocket/track", require("./routes/shiprocket/track.routes"));

//firebase
app.use("/firebase", require("./routes/firebase/firebase.routes"));

app.use(
  "/image-bg-color",
  require("./routes/image-bg-color/imageColor.routes")
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
