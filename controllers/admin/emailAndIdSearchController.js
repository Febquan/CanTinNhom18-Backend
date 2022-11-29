const OrdersModel = require("../../Model/orders");
const { validationResult, body } = require("express-validator");
const emailAndIdSearch = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    let = "";
    let orderId = "";
    if (!errors.isEmpty()) {
      //not EMail

      orderId = req.body.search;
      if (orderId.length !== 24) {
        throw new Error("Id đơn hàng không hợp lệ");
      }
      const orders = await OrdersModel.find({ _id: orderId })
        .populate("user")
        .populate("order.object")
        .populate("order.extraFood.object");
      if (!orders) {
        throw new Error("Không tìm thấy đơn hàng");
      }
      res.status(200).json({
        content: orders,
        ok: true,
      });
    } else {
      email = req.body.search;
      if (!email) {
        throw new Error("Nhập không hợp lệ");
      }
      let orders = await OrdersModel.find()
        .populate("user")
        .populate("order.object")
        .populate("order.extraFood.object");

      orders = orders.filter(
        (el) => el.email === email || (el.user && el.user.email === email)
      );

      if (orders.length == 0) {
        throw new Error("Không tìm thấy đơn hàng");
      }
      res.status(200).json({
        content: orders,
        ok: true,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = emailAndIdSearch;
