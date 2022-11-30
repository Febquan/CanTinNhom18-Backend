const OrdersModel = require("../../Model/orders");
const findOrderAndUpdate = async (req, res, next) => {
  try {
    const orderId = req.body.order._id;
    const order = req.body.order;
    const orderUpdated = await OrdersModel.findOneAndUpdate(
      { _id: orderId },

      order
    );

    res.status(200).json({
      content: orderUpdated,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findOrderAndUpdate;
