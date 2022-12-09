const express = require("express");
const router = express.Router();

const seeFastFoodAndDrinkController = require("../../controllers/admin/seeFastFoodAndDrink");
const searchFastFoodAndDrinkController = require("../../controllers/admin/searchFFADController");
const findFFADAndUpdateController = require("../../controllers/admin/findFFADAndUpdateController");
const findFFADAndDeleteController = require("../../controllers/admin/findFFADAndDelete");
// const doOrderController = require("../../controllers/admin/doOrderController");
router.get("/seeFastFoodAndDrink", seeFastFoodAndDrinkController);
router.post("/searchFastFoodAndDrink", searchFastFoodAndDrinkController);
router.post("/findFFADAndUpdate", findFFADAndUpdateController);
router.post("/findFFADAndDelete", findFFADAndDeleteController);
module.exports = router;
