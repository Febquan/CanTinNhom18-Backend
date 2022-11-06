const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mailer = require("../../../utils/mailer");
const User = require("../../../Model/user");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.errors[0].msg);
      error.statusCode = 422;
      throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 12);
    const hashedEmail = await bcrypt.hash(email, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
    });
    const result = await user.save();
    mailer(
      result.email,
      "Căn tin nhóm 18 email verification",
      `<h2>Xin vui lòng click vào <a href="${process.env.APP_URL}/user/verify?email=${email}&token=${hashedEmail}">đường link này</a> để xác thực mail của bạn</h2>
      
      `
    );
    res
      .status(201)
      .json({ message: "Tạo user thành công!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User không tồn tại !");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Sai mật khẩu !");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.TOKEN_PRIVATE_KEY
        // { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.verify = async (req, res, next) => {
  try {
    const email = req.query.email;
    const hashedEmail = req.query.token;
    const isVerify = await bcrypt.compare(email, hashedEmail);
    if (isVerify == true) {
      await User.findOneAndUpdate({ email: email }, { emailVerify: true });
      res.status(200).json({ message: "Xác thực Email thành công" });
    } else {
      const error = new Error("Hệ thống không xác thực được email này !");
      error.statusCode = 401;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
