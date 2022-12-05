const express = require("express");
const router = express.Router();

const seeFastFoodAndDrinkController = require("../../controllers/admin/seeFastFoodAndDrink");
// const doOrderController = require("../../controllers/admin/doOrderController");
router.get("/seeFastFoodAndDrink", seeFastFoodAndDrinkController);

module.exports = router;
