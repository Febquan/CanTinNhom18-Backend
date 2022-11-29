const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const seeOrdersController = require("../../controllers/admin/seeOrdersController");
const setOrderStatusController = require("../../controllers/admin/setOrdersStatusController");
const paidOrdersController = require("../../controllers/admin/paidOrdersController");
const seeOneOrderController = require("../../controllers/admin/seeOneOrdersController");
const searchEmailController = require("../../controllers/admin/searchEmailController");
// const doOrderController = require("../../controllers/admin/doOrderController");
router.get("/seeOrders", seeOrdersController);
router.post("/setOrderStatus", setOrderStatusController);
router.put("/paidOrder/:orderId", paidOrdersController);
router.post("/seeOneOrder", seeOneOrderController);
router.post(
  "/searchEmailStatus",
  [body("email").isEmail().withMessage("Email không hợp lệ")],
  searchEmailController
);
// router.post("/doOrder", doOrderController);
module.exports = router;
searchEmailController;
