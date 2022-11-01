const express = require("express");
const controller = require("../../controllers/admin/addDishController");

const router = express.Router();

router.get("/addDish", controller.AddDish);

module.exports = router;
