const OrdersModel = require("../../Model/orders");

const io = require("../../utils/getSocketConnection");

const completeOrdersController = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    const status = req.body.status;
    const order = await OrdersModel.findOneAndUpdate(
      { _id: orderId },
      { status: status }
    );
    if (status === "waiting") {
      io.getIO().emit("OrderIsDone", { orderComplete: orderId });
    }
    res.status(200).json({
      content: order,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = completeOrdersController;
