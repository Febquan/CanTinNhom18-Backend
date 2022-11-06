const OrdersModel = require("../../Model/orders");
const completeOrdersModel = require("../../Model/completeOrders");
const completeOrdersController = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    const order = await OrdersModel.findOneAndDelete({ _id: orderId });
    const completeOrder = new completeOrdersModel({
      ...order._doc,
      status: "wait",
      statusCode: 0,
    });
    await completeOrder.save();
    res.status(200).json({
      order,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = completeOrdersController;
