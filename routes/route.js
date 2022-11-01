const express = require("express");
const controller = require("../controllers/feed");

const router = express.Router();

router.get("/post", controller.getPost);

module.exports = router;
