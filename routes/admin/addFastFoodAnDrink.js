const express = require("express");
const controller = require("../../controllers/admin/addFastFoodController");

const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/addFFAD",
  body("name")
    .isLength({ min: 5, max: 30 })
    .withMessage("Tên của món ăn quá dài !"),
  controller.addFastFoodAndDrink
);

module.exports = router;
