const OrdersModel = require("../../Model/orders");
const FFADModel = require("../../Model/fastFoodAndDrink");
const DishModel = require("../../Model/dish");
const ExtraFoodModel = require("../../Model/extraFood");
const io = require("../../utils/getSocketConnection");
const adminSockets = require("../../utils/adminSocket");
const dayjs = require("dayjs");
const checkToday = require("../../utils/isToday");
const deleteOrder = async (req, res, next) => {
  try {
    const order = await OrdersModel.findById(req.body.orderId);
    if (order.status === "doing") {
      const error = new Error(`Đơn hàng đã được làm không thể xóa order !`);
      error.statusCode = 422;
      throw error;
    }

    for ([index, item] of order.order.entries()) {
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
      if (item.kind === "Dish" && checkToday(order.arrive_at)) {
        const dishFound = await DishModel.findById(item.object._id);
        dishFound.amountAvailable = dishFound.amountAvailable + item.quantity;
        await dishFound.save();
        for (extraFood of item.extraFood) {
          const extraFoodFound = await ExtraFoodModel.findById(
            extraFood.object._id
          );
          extraFoodFound.amountAvailable =
            extraFoodFound.amountAvailable + extraFood.quantity;
          await extraFoodFound.save();
        }
      }
    }

    await order.remove();
    adminSockets.getAdminSocketIds().forEach((socket) => {
      io.getIO().to(socket).emit("QueueChange", {
        message: "OrderRemoved",
        orderId: req.body.orderId,
      });
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
