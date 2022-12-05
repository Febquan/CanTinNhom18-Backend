const OrdersModel = require("../../Model/orders");
const FFADModel = require("../../Model/fastFoodAndDrink");
const dayjs = require("dayjs");
const findOrderAndDelete = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    const delOrder = await OrdersModel.findOne({ _id: orderId });

    for ([index, item] of delOrder.order.entries()) {
      if (item.kind === "FastFoodAndDrink") {
        const FFAD = await FFADModel.findById(item.object._id);
        for (batch of item.batchInfo) {
          const index2 = FFAD.batch.findIndex(
            (el) =>
              dayjs(el.expiredDated).diff(dayjs(batch.expiredDated)) == 0 &&
              dayjs(batch.buyDate).diff(dayjs(el.buyDate)) == 0
          );

          FFAD.batch[index2].quantity =
            FFAD.batch[index2].quantity + batch.quantity;
        }

        await FFAD.save();
      }
    }
    await delOrder.remove();
    res.status(200).json({
      content: delOrder,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findOrderAndDelete;
