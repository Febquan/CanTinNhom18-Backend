const Orders = require("../../Model/orders");

watchMyOrdersAuthController = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (userId) {
      const dbRes = await Orders.find({ user: userId }).populate(
        "order.object"
      );
      res.status(200).json({
        orders: dbRes,
        ok: true,
      });
    } else {
      const dbRes = await Orders.find({ email: req.params.email }).populate(
        "order.object"
      );
      res.status(200).json({
        orders: dbRes,
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
module.exports = watchMyOrdersAuthController;
