const express = require("express");
const { body } = require("express-validator");

const addFastFoodController = require("../../controllers/admin/addFastFoodController");
const addDishController = require("../../controllers/admin/addDishController");
const addMultipleFastFoodController = require("../../controllers/admin/addMultipleFastFoodController");
const lockDishController = require("../../controllers/admin/lockDishController");
const addExtraFoodController = require("../../controllers/admin/addExtraFoodController");
const lockExtraFoodController = require("../../controllers/admin/lockExtraFoodController");
const router = express.Router();

router.post(
  "/addDish",
  body("name")
    .isLength({ min: 5, max: 30 })
    .withMessage("Tên của món ăn quá dài !"),
  addDishController
);

router.post(
  "/addFFAD",
  body("name")
    .isLength({ min: 5, max: 30 })
    .withMessage("Tên của món ăn quá dài !"),
  addFastFoodController
);

router.post("/addMultipleFFAD", addMultipleFastFoodController);

router.post("/lockDish", lockDishController);
router.post("/addExtraFood", addExtraFoodController);
router.post("/lockExtraFood", lockExtraFoodController);
module.exports = router;
