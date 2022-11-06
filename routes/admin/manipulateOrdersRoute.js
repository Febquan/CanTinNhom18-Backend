const express = require("express");
const router = express.Router();
const seeOrdersController = require("../../controllers/admin/seeOrdersController");
const completeOrdersController = require("../../controllers/admin/completeOrdersController");
const paidOrdersController = require("../../controllers/admin/paidOrdersController");
router.get("/seeOrders", seeOrdersController);
router.post("/completeOrder", completeOrdersController);
router.put("/paidOrder/:orderId", paidOrdersController);

module.exports = router;
