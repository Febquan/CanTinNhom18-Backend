require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

//admin route
const adminAuthRoute = require("./routes/admin/auth/adminAuthRoute");
const addFoodRoute = require("./routes/admin/addFoodRoute");
const isAdminRoute = require("./routes/admin/auth/is-admin");
const manipulateOrdersRoute = require("./routes/admin/manipulateOrdersRoute");

//user route
const userAuthRoute = require("./routes/user/auth/userAuthRoute");
const isUserRoute = require("./routes/user/auth/is-user");
const placeOrderRoute = require("./routes/user/placeOrderRoute");
const restorePasswordRoute = require("./routes/user/auth/restorePasswordRoute");
const changePasswordRoute = require("./routes/user/auth/changePasswordRoute");
const displayRoute = require("./routes/user/displayRoute");
// Image upload
const path = require("path");
const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      (new Date().toISOString() + "-" + file.originalname).replace(/:/g, "-")
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

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

app.use("/admin", adminAuthRoute);
app.use("/admin", isAdminRoute, addFoodRoute);
app.use("/admin", isAdminRoute, manipulateOrdersRoute);

app.use("/user", userAuthRoute);
app.use("/user", userAuthRoute);
app.use("/user", displayRoute);
app.use("/user", isUserRoute, placeOrderRoute);
app.use("/user", isUserRoute, changePasswordRoute);
app.use("/user", restorePasswordRoute);
app.get("/", (req, res, next) => {
  res.send("hello");
});
//Error Handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(process.env.MOGOODB_DATABASE_LINK)
  .then((result) => {
    const server = app.listen(process.env.PORT);
    const io = require("./utils/getSocketConnection").init(server);
    io.on("connection", (socket) => {
      console.log("client connected");
      socket.emit("adminSocketId", socket.id);
      socket.on("adminConnect", (adminSocketId) => {
        require("./utils/adminSocket").init(adminSocketId);
        console.log(adminSocketId);
      });
    });
  })
  .catch((err) => console.log(err));
