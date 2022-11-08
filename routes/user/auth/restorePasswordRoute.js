const express = require("express");
const userAuthController = require("../../../controllers/user/auth/userAuthController");

const router = express.Router();

router.post("/restorePassword", userAuthController.restorePassword);
module.exports = router;
