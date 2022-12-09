const FFADModel = require("../../Model/fastFoodAndDrink");
const OrdersModel = require("../../Model/orders");
const findFFADAndUpdate = async (req, res, next) => {
  try {
    const FFADId = req.body.FFAD._id;
    const FFAD = req.body.FFAD;
    await FFADModel.findOneAndUpdate({ _id: FFADId }, FFAD);
    //update price
    let existFFADInSomeOrders = await OrdersModel.find({
      order: { $elemMatch: { object: { _id: FFADId } } },
    })
      .populate("order.object")
      .populate("order.extraFood.object");

    //PRICE RENEW
    await Promise.all(
      existFFADInSomeOrders.map(async (order) => {
        order.cost = order.order.reduce(
          (sum, cur) =>
            sum +
            cur.object.price * cur.quantity +
            cur.extraFood.reduce(
              (sum, cur) => sum + cur.object.price * cur.quantity,
              0
            ),
          0
        );
        return await order.save();
      })
    );

    res.status(200).json({
      content: existFFADInSomeOrders,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findFFADAndUpdate;
