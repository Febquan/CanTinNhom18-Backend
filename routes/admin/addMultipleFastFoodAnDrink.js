const express = require("express");
const controller = require("../../controllers/admin/addMultipleFastFoodController");

const router = express.Router();

router.post("/addMultipleFFAD", controller.addFastMultipleFoodAndDrink);

module.exports = router;
