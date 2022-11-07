const completeOrdersModel = require("../../Model/completeOrders");
const OrdersModel = require("../../Model/orders");
const paidOrders = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const orderPaid = await OrdersModel.findOneAndDelete({ _id: orderId });
    const completeOrder = new completeOrdersModel({
      ...orderPaid._doc,
      status: "paid",
    });
    await completeOrder.save();

    res.status(200).json({
      orderPaid,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = paidOrders;
