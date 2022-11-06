const express = require("express");
const { body } = require("express-validator");

const User = require("../../../Model/user");
const userAuthController = require("../../../controllers/user/auth/userAuthController");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((AdminDoc) => {
          if (AdminDoc) {
            return Promise.reject("E-Mail Đã được đăng ký");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  userAuthController.signup
);

router.post("/login", userAuthController.login);

router.get("/verify", userAuthController.verify);

module.exports = router;
