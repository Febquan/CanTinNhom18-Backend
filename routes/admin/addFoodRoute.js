const express = require("express");
const { body } = require("express-validator");

const addFastFoodController = require("../../controllers/admin/addFastFoodController");
const addDishController = require("../../controllers/admin/addDishController");
const addMultipleFastFoodController = require("../../controllers/admin/addMultipleFastFoodController");
const lockDishController = require("../../controllers/admin/lockDishController");
const addExtraFoodController = require("../../controllers/admin/addExtraFoodController");
const lockExtraFoodController = require("../../controllers/admin/lockExtraFoodController");
const toggleAvailableController = require("../../controllers/admin/toggleAvailable");
const searchFoodController = require("../../controllers/admin/searchFoodController");
const findFoodAndDeleteController = require("../../controllers/admin/findFoodAndDeleteController");
const findFoodAndUpdateController = require("../../controllers/admin/findFoodAndUpdateController");
const findFoodUpdateEveryDayAmountController = require("../../controllers/admin/findFoodUpdateEveryDayAmount");
const router = express.Router();

router.post(
  "/addDish",
  body("name")
    .isLength({ min: 5, max: 30 })
    .withMessage("Tên của món ăn quá dài,hoặc quá ngắn !"),
  addDishController
);

router.post(
  "/addFFAD",
  body("name")
    .isLength({ min: 5, max: 30 })
    .withMessage("Tên của món ăn quá dài,hoặc quá ngắn !"),
  addFastFoodController
);

router.post("/addMultipleFFAD", addMultipleFastFoodController);

router.post("/lockDish", lockDishController);
router.post("/addExtraFood", addExtraFoodController);
router.post("/lockExtraFood", lockExtraFoodController);

router.post("/toggleAvailable", toggleAvailableController);
router.post("/searchFood", searchFoodController);
router.post("/findFoodAndDelete", findFoodAndDeleteController);
router.post("/findFoodAndUpdate", findFoodAndUpdateController);
router.post(
  "/findFoodUpdateEveryDayAmount",
  findFoodUpdateEveryDayAmountController
);
module.exports = router;
