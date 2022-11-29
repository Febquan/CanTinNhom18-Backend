const OrdersModel = require("../../Model/orders");
const { validationResult } = require("express-validator");
const emailSearch = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.errors[0].msg);
      error.statusCode = 422;
      throw error;
    }
    const email = req.body.email;
    const status = req.body.status;
    if (!email || !status) {
      throw new Error("Nhập không hợp lệ");
    }
    let orders = await OrdersModel.find({ status: status })
      .populate("user")
      .populate("order.object")
      .populate("order.extraFood.object");
    // .find({
    //   $or: [{ email: email, status: status }, { "user.email": email }],
    // });
    orders = orders.filter(
      (el) => el.email === email || el.user.email === email
    );
    if (!orders) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    res.status(200).json({
      content: orders,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = emailSearch;
