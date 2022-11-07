const OrdersModel = require("../../Model/orders");

const io = require("../../utils/getSocketConection");

const completeOrdersController = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;

    const order = await OrdersModel.findOneAndUpdate(
      { _id: orderId },
      { status: "waiting" }
    );
    io.getIO().emit("OrderIsDone", { orderComplete: orderId });
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
