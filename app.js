const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const addDishRoute = require("./routes/admin/addDishRoute");
const addFFAD = require("./routes/admin/addFastFoodAnDrink");
const addMultipleFFAD = require("./routes/admin/addMultipleFastFoodAnDrink");

const placeOrder = require("./routes/user/placeOrder");

//Database URL
const MOGOODB_DATABASE_LINK =
  "mongodb+srv://febquan1:Aloalo123@cantinnmcnpm.xwgf2ug.mongodb.net/test";
//Post
app.use(bodyParser.json());

//Allowance
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/admin", addDishRoute); //  /admin/addDish
app.use("/admin", addFFAD);
app.use("/admin", addMultipleFFAD);
app.use("/user", placeOrder); //  /admin/addDish

//Error Handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(MOGOODB_DATABASE_LINK)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
