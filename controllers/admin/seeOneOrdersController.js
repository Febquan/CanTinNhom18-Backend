const OrdersModel = require("../../Model/orders");

const seeOneOrder = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    const orders = await OrdersModel.findOne({ _id: orderId })
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
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = seeOneOrder;
