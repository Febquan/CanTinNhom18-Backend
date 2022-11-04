const express = require("express");
const { body } = require("express-validator");

const Admin = require("../../../Model/admin");
const adminAuthController = require("../../../controllers/admin/auth/adminAuthController");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Admin.findOne({ email: value }).then((AdminDoc) => {
          if (AdminDoc) {
            return Promise.reject("E-Mail Đã được đăng ký");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  adminAuthController.signup
);

router.post("/login", adminAuthController.login);

module.exports = router;
