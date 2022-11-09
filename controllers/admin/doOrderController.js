const OrdersModel = require("../../Model/orders");
const paidOrders = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    const orderDoing = await OrdersModel.findOneAndUpdate(
      { _id: orderId },
      { status: "doing" }
    );

    res.status(200).json({
      content: orderDoing,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = paidOrders;
