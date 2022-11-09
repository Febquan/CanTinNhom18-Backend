const express = require("express");
const router = express.Router();
const seeOrdersController = require("../../controllers/admin/seeOrdersController");
const completeOrdersController = require("../../controllers/admin/completeOrdersController");
const paidOrdersController = require("../../controllers/admin/paidOrdersController");
const doOrderController = require("../../controllers/admin/doOrderController");
router.get("/seeOrders", seeOrdersController);
router.post("/completeOrder", completeOrdersController);
router.put("/paidOrder/:orderId", paidOrdersController);
router.post("/doOrder", doOrderController);
module.exports = router;
