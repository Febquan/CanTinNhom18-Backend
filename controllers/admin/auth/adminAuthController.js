const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../../../Model/admin");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.errors[0].msg);
    error.statusCode = 422;
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const admin = new Admin({
        email: email,
        password: hashedPw,
        name: name,
      });
      return admin.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Tạo admin thành công!",
        userId: result._id,
        ok: true,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  Admin.findOne({ email: email })
    .then((admin) => {
      if (!admin) {
        const error = new Error("Admin không tồn tại !");
        error.statusCode = 400;
        throw error;
      }
      loadedUser = admin;
      return bcrypt.compare(password, admin.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Sai mật khẩu !");
        error.statusCode = 400;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          adminId: loadedUser._id.toString(),
        },
        process.env.TOKEN_PRIVATE_KEY,
        { expiresIn: "24h" }
      );
      res
        .status(200)
        .json({ token: token, adminId: loadedUser._id.toString(), ok: true });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.checkAutoLogin = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    if (adminId) {
      res.status(200).json({ ok: true });
    } else {
      const error = new Error("Lần đăng nhập đã hết hạn");
      error.statusCode = 400;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
