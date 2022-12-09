const FFADModel = require("../../Model/fastFoodAndDrink");
const OrdersModel = require("../../Model/orders");
const findFFADAndDelete = async (req, res, next) => {
  try {
    const FFADId = req.body.FFADid;
    const existFFADInSomeOrders = await OrdersModel.findOne({
      order: { $elemMatch: { object: { _id: FFADId } } },
    });

    if (existFFADInSomeOrders) {
      throw new Error(
        "Sản phẩm đã được đặt hàng trong đơn hàng vui lòng xử lý đơn hàng"
      );
    }
    const FFADDeleted = await FFADModel.findOneAndDelete({ _id: FFADId });

    res.status(200).json({
      content: FFADDeleted,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findFFADAndDelete;
