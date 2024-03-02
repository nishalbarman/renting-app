const express = require("express");
const dbConnect = require("./config/dbConfig");

dbConnect(); // connect to databse

const app = express();

app.use("/*", (_, res) => {
  res.send({ message: "It's working nicely!" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
