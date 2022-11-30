const OrdersModel = require("../../Model/orders");
const findOrderAndDelete = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    const orderDelete = await OrdersModel.findOneAndDelete({ _id: orderId });

    res.status(200).json({
      content: orderDelete,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findOrderAndDelete;
