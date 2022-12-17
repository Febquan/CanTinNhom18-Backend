const dayjs = require("dayjs");
const completeOrdersModel = require("../../Model/completeOrders");
const OrdersModel = require("../../Model/orders");

const paidOrders = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const orderPaid = await OrdersModel.findOne({ _id: orderId });

    const completeOrder = await new completeOrdersModel({
      ...orderPaid._doc,
      status: "paid",
      pay_at: dayjs(),
    });

    await orderPaid.remove();
    await completeOrder.save();

    res.status(200).json({
      content: orderPaid,
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
