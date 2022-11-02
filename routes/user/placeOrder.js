const express = require("express");
const controller = require("../../controllers/user/placeOrderController");

const router = express.Router();

router.post("/placeOrder", controller.placeOrder);

module.exports = router;
