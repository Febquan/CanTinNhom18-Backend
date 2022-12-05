const OrdersModel = require("../../Model/orders");
const FFADModel = require("../../Model/fastFoodAndDrink");
const dayjs = require("dayjs");
const findOrderAndUpdate = async (req, res, next) => {
  try {
    const orderId = req.body.order._id;
    const order = req.body.order; //moi
    const orderUpdated = await OrdersModel.findOne({ _id: orderId }); //cu

    for ([index, item] of orderUpdated.order.entries()) {
      if (item.kind === "FastFoodAndDrink") {
        const quantityChange = order.order[index].quantity - item.quantity;
        const oldFFAD = await FFADModel.findById({ _id: item.object._id });

        if (quantityChange > 0) {
          orderUpdated.order[index].quantity += quantityChange;

          let amountAvailable = oldFFAD.batch.reduce(
            (amountAvailable, el) => amountAvailable + el.quantity,
            0
          );

          if (amountAvailable < quantityChange) {
            const error = new Error(
              `Sản phẩm ${oldFFAD.name} này chỉ còn lại ${amountAvailable} so với số lượng cần thêm là ${quantityChange} !`
            );
            error.statusCode = 422;
            throw error;
          }

          let remain = quantityChange;
          const batchInfo = [];
          for ([index2, batch] of oldFFAD.batch.entries()) {
            if (dayjs().diff(dayjs(batch.expiredDated)) < 0) {
              remain = batch.quantity - remain;

              if (remain >= 0) {
                const takeOut = oldFFAD.batch[index2].quantity - remain;
                oldFFAD.batch[index2].quantity = remain;
                batchInfo.push({
                  quantity: takeOut,
                  expiredDated: oldFFAD.batch[index2].expiredDated,
                  buyDate: oldFFAD.batch[index2].buyDate,
                });
                break;
              }
              if (remain < 0) {
                const takeOut = oldFFAD.batch[index2].quantity;
                oldFFAD.batch[index2].quantity = 0;
                batchInfo.push({
                  quantity: takeOut,
                  expiredDated: oldFFAD.batch[index2].expiredDated,
                  buyDate: oldFFAD.batch[index2].buyDate,
                });
                remain = -remain;
              }
            }
          }

          orderUpdated.order[index].batchInfo.push(...batchInfo);
        }

        if (quantityChange < 0) {
          let remain = -quantityChange;
          orderUpdated.order[index].quantity -= quantityChange;
          for ([index3, batchOrder] of item.batchInfo.entries()) {
            const index2 = oldFFAD.batch.findIndex(
              (el) =>
                dayjs(el.expiredDated).diff(dayjs(batchOrder.expiredDated)) ==
                  0 && dayjs(batchOrder.buyDate).diff(dayjs(el.buyDate)) == 0
            );
            let plus = remain;
            remain = batchOrder.quantity - remain;
            console.log(remain);
            if (remain > 0) {
              orderUpdated.order[index].batchInfo[index3].quantity = remain;

              oldFFAD.batch[index2].quantity =
                oldFFAD.batch[index2].quantity + plus;
            }
            if (remain < 0) {
              oldFFAD.batch[index2].quantity =
                oldFFAD.batch[index2].quantity + batchOrder.quantity;
              orderUpdated.order[index].batchInfo[index3].quantity = 0;
              remain = -remain;
            }
          }
        }

        await oldFFAD.save();
      }
    }

    // console.log(orderUpdated.order[0].batchInfo, "order moi");
    await orderUpdated.save();
    res.status(200).json({
      content: orderUpdated,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findOrderAndUpdate;
