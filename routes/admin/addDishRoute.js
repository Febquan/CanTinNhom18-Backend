const express = require("express");
const controller = require("../../controllers/admin/addDishController");

const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/addDish",
  body("name")
    .isLength({ min: 5, max: 30 })
    .withMessage("Tên của món ăn quá dài !"),
  controller.AddDish
);

module.exports = router;
