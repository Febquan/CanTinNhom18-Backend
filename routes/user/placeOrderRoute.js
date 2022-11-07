const express = require("express");
const placeOrderController = require("../../controllers/user/placeOrderController");
const watchMyOrdersAuthController = require("../../controllers/user/watchMyOrdersController");
const deleteOrderController = require("../../controllers/user/deleteOrderController");
const router = express.Router();

router.post("/placeOrder", placeOrderController);
router.get("/watchMyOrder", watchMyOrdersAuthController);
router.get("/watchMyOrder/:email", watchMyOrdersAuthController);
router.put("/deleteOrder", deleteOrderController);
module.exports = router;
