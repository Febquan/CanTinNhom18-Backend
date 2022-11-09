const OrdersModel = require("../../Model/orders");

const seeOrders = async (req, res, next) => {
  try {
    const orders = await OrdersModel.find()
      .sort({
        arrive_at: 1,
        created_at: 1,
      })
      .populate("order.object");

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

module.exports = seeOrders;
