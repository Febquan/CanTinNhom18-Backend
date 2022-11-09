const Orders = require("../../Model/orders");
const io = require("../../utils/getSocketConnection");
const adminSockets = require("../../utils/adminSocket");
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Orders.findById(req.body.orderId);
    if (order.status === "doing") {
      const error = new Error(`Đơn hàng đã được làm không thể xóa order !`);
      error.statusCode = 422;
      throw error;
    }
    await order.remove();
    adminSockets.getAdminSocketIds().forEach((socket) => {
      io.getIO().to(socket).emit("queueChange", "orderRemoved");
    });
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

module.exports = deleteOrder;
