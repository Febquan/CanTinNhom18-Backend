const OrdersModel = require("../../Model/orders");
const FFADModel = require("../../Model/fastFoodAndDrink");
const DishModel = require("../../Model/dish");
const ExtraFoodModel = require("../../Model/extraFood");
const checkToday = require("../../utils/isToday");
const dayjs = require("dayjs");
const findOrderAndUpdate = async (req, res, next) => {
  try {
    const orderId = req.body.order._id;
    const order = req.body.order; //moi
    const orderUpdated = await OrdersModel.findOne({ _id: orderId }); //cu

    //check FFAD adding is available
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
        }
      }
    }

    for ([index, item] of orderUpdated.order.entries()) {
      if (item.kind === "FastFoodAndDrink") {
        const quantityChange = order.order[index].quantity - item.quantity;
        const oldFFAD = await FFADModel.findById({ _id: item.object._id });

        if (quantityChange > 0) {
          orderUpdated.order[index].quantity += quantityChange;

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
          orderUpdated.order[index].quantity += quantityChange;
          for ([index3, batchOrder] of item.batchInfo.entries()) {
            const index2 = oldFFAD.batch.findIndex(
              (el) =>
                dayjs(el.expiredDated).diff(dayjs(batchOrder.expiredDated)) ==
                  0 && dayjs(batchOrder.buyDate).diff(dayjs(el.buyDate)) == 0
            );
            let plus = remain;
            remain = batchOrder.quantity - remain;

            if (remain >= 0) {
              orderUpdated.order[index].batchInfo[index3].quantity = remain;

              oldFFAD.batch[index2].quantity =
                oldFFAD.batch[index2].quantity + plus;

              break;
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
    //compress the change
    let amountOfFoodChange = [];
    let amountOfExtraFoodChange = [];

    for ([index, food] of order.order.entries()) {
      if (food.kind == "Dish") {
        const existIndex = amountOfFoodChange.findIndex(
          (el) => el._id.toString() == food.object._id.toString()
        );

        if (existIndex == -1) {
          amountOfFoodChange.push({
            _id: food.object._id,
            kind: food.kind,
            quantity: food.quantity - orderUpdated.order[index].quantity,
          });
        }
        if (existIndex != -1) {
          amountOfFoodChange[existIndex].quantity +=
            food.quantity - orderUpdated.order[index].quantity;
        }
        if (!food.extraFood) {
          continue;
        }
        for ([index2, extraFood] of food.extraFood.entries()) {
          const existExtraFoodIndex = amountOfExtraFoodChange.findIndex(
            (el) => el._id.toString() == extraFood.object._id.toString()
          );

          if (existExtraFoodIndex == -1) {
            amountOfExtraFoodChange.push({
              _id: extraFood.object._id,
              quantity:
                extraFood.quantity -
                orderUpdated.order[index].extraFood[index2].quantity,
            });
          }
          if (existExtraFoodIndex != -1) {
            amountOfExtraFoodChange[existExtraFoodIndex].quantity +=
              extraFood.quantity -
              orderUpdated.order[index].extraFood[index2].quantity;
          }
        }
      }
    }
    //testing adding amount is available
    console.log(amountOfFoodChange, amountOfExtraFoodChange);
    for (food of amountOfFoodChange) {
      const dish = await DishModel.findOne({ _id: food._id });
      const afterAdding = dish.amountAvailable - food.quantity;

      if (afterAdding < 0 || afterAdding > dish.everyDayAmount) {
        const error = new Error(
          `Sản phẩm ${dish.name} này chỉ còn lại ${dish.amountAvailable} so với số lượng cần thêm là ${food.quantity} !`
        );
        error.statusCode = 422;
        throw error;
      }
    }
    for (extraFood of amountOfExtraFoodChange) {
      const extraF = await ExtraFoodModel.findOne({ _id: extraFood._id });
      const afterAdding = extraF.amountAvailable - extraFood.quantity;
      console.log(afterAdding);
      if (afterAdding < 0 || afterAdding > extraF.everyDayAmount) {
        const error = new Error(
          `Sản phẩm ${extraF.name} này chỉ còn lại ${extraF.amountAvailable} so với số lượng cần thêm là ${extraFood.quantity} !`
        );
        error.statusCode = 422;
        throw error;
      }
    }
    // change Dish and extraFood quantity left
    for (food of amountOfFoodChange) {
      const dish = await DishModel.findOne({ _id: food._id });
      const afterAdding = dish.amountAvailable - food.quantity;
      dish.amountAvailable = afterAdding;
      dish.save();
    }
    for (extraFood of amountOfExtraFoodChange) {
      const extraF = await ExtraFoodModel.findOne({ _id: extraFood._id });
      const afterAdding = extraF.amountAvailable - extraFood.quantity;
      extraF.amountAvailable = afterAdding;
      extraF.save();
    }
    //change order
    for ([index, item] of orderUpdated.order.entries()) {
      orderUpdated.order[index] = order.order[index];
    }

    orderUpdated.cost = order.cost;
    orderUpdated.created_at = order.created_at;
    orderUpdated.onSite = order.onSite;
    orderUpdated.status = order.status;
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
