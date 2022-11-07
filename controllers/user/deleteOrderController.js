const Orders = require("../../Model/orders");

const deleteOrder = async (req, res, next) => {
  try {
    const dbRes = await Orders.findByIdAndDelete(req.body.orderId);
    res.status(200).json({
      content: dbRes,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = deleteOrder;
