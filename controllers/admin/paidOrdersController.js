const completeOrdersModel = require("../../Model/completeOrders");
const paidOrders = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    const orderPaid = await completeOrdersModel.findOneAndUpdate(
      { _id: orderId },
      { status: "paid" }
    );
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
