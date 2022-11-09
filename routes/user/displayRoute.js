const express = require("express");
const seeAllFoodController = require("../../controllers/user/seeAllFoodContoller");
const router = express.Router();

router.get("/seeAllFood", seeAllFoodController);

module.exports = router;
