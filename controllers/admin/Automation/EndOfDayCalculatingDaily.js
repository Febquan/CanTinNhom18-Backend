const dayjs = require("dayjs");
const DailyBusinessModel = require("../../../Model/dailyBusiness");
const OrdersModel = require("../../../Model/orders");
const FFADModel = require("../../../Model/fastFoodAndDrink");
const DishModel = require("../../../Model/dish");
const ExtraFoodModel = require("../../../Model/extraFood");
const CompleteOrdersModel = require("../../../Model/completeOrders");
const schedule = require("node-schedule");
const checkToday = require("../../../utils/isToday");

async function endOfDayCalculatingBusiness() {
  try {
    const dailyBusiness = await DailyBusinessModel.findOne({
      date: {
        $gte: dayjs().startOf("day"),
        $lte: dayjs().endOf("day"),
      },
    });
    //Checking expenses is all not eaqual too 0
    let zero = false;
    for (item of dailyBusiness.expenses) {
      if (item.cost == 0) {
        zero = true;
      }
    }
    if (zero == true) {
      dailyBusiness.status = "invalidExpenses";
      await dailyBusiness.save();
      console.log("Invalid Expenses");
      return;
    }

    const orderUnpaid = await OrdersModel.find({
      arrive_at: {
        $gte: dayjs().startOf("day"),
        $lte: dayjs().endOf("day"),
      },
    })
      .populate("order.object")
      .populate("order.extraFood.object");

    //remove order adding all left-over food back to store
    for (orderU of orderUnpaid) {
      for ([index, item] of orderU.order.entries()) {
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
        if (item.kind === "Dish" && checkToday(orderU.arrive_at)) {
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
      await orderU.remove();
    }
    //calculate loss and income for DISH and ExtraFood

    const allDish = await DishModel.find();
    const allExtraFood = await ExtraFoodModel.find();
    for (dish of allDish) {
      const index4 = dailyBusiness.expenses.findIndex(
        (el) => el.name == dish.name
      );
      if (index4 == -1) {
        continue;
      }
      const realDishPrice =
        dailyBusiness.expenses[index4].cost /
        dailyBusiness.expenses[index4].amount;

      dailyBusiness.totalLoss += dish.amountAvailable * realDishPrice;
      dailyBusiness.income +=
        (dish.everyDayAmount - dish.amountAvailable) * realDishPrice;
      if (dish.amountAvailable > 0) {
        dailyBusiness.loss.push({
          name: dish.name,
          amount: dish.amountAvailable,
          cost: (dish.amountAvailable * realDishPrice).toFixed(2),
        });
      }
      if (dish.amountAvailable < dish.everyDayAmount) {
        dailyBusiness.selling.push({
          name: dish.name,
          amount: dish.everyDayAmount - dish.amountAvailable,
          cost: (
            (dish.everyDayAmount - dish.amountAvailable) *
            realDishPrice
          ).toFixed(2),
        });
      }
    }
    for (extraFood of allExtraFood) {
      const index4 = dailyBusiness.expenses.findIndex(
        (el) => el.name == extraFood.name
      );
      if (index4 == -1) {
        continue;
      }
      const realExtraFoodPrice =
        dailyBusiness.expenses[index4].cost /
        dailyBusiness.expenses[index4].amount;
      dailyBusiness.totalLoss += extraFood.amountAvailable * realExtraFoodPrice;
      dailyBusiness.income +=
        (extraFood.everyDayAmount - extraFood.amountAvailable) *
        realExtraFoodPrice;
      if (extraFood.amountAvailable > 0) {
        dailyBusiness.loss.push({
          name: extraFood.name,
          amount: extraFood.amountAvailable,
          cost: (extraFood.amountAvailable * realExtraFoodPrice).toFixed(2),
        });
      }
      if (extraFood.amountAvailable < extraFood.everyDayAmount) {
        dailyBusiness.selling.push({
          name: extraFood.name,
          amount: extraFood.everyDayAmount - extraFood.amountAvailable,
          cost: (
            (extraFood.everyDayAmount - extraFood.amountAvailable) *
            realExtraFoodPrice
          ).toFixed(2),
        });
      }
    }
    //calculate income for FFAD
    //add to dailybusines

    const todayCompleteOrders = await CompleteOrdersModel.find({
      pay_at: {
        $gte: dayjs().startOf("day"),
        $lte: dayjs().endOf("day"),
      },
    })
      .populate("order.object")
      .populate("order.extraFood.object");
    for (todayCompleteOrder of todayCompleteOrders) {
      for (food of todayCompleteOrder.order) {
        if (food.kind == "FastFoodAndDrink") {
          //add to selling figure
          const index = dailyBusiness.selling.findIndex(
            (el) => el.name == food.object.name
          );
          if (index !== -1) {
            dailyBusiness.selling[index].amount += food.quantity;
            dailyBusiness.selling[index].cost +=
              food.quantity * food.object.price;
          }
          if (index == -1) {
            dailyBusiness.selling.push({
              name: food.object.name,
              amount: food.quantity,
              cost: food.object.price * food.quantity,
            });
          }
          dailyBusiness.income += food.object.price * food.quantity;
          //add to expenses figure
          const index2 = dailyBusiness.expenses.findIndex(
            (el) => el.name == food.object.name
          );
          const FFAD = await FFADModel.findById(food.object._id);
          if (index2 !== -1) {
            for (batch of food.batchInfo) {
              if (batch.quantity != 0) {
                dailyBusiness.expenses[index2].amount += batch.quantity;

                const index3 = FFAD.batch.findIndex(
                  (el) =>
                    dayjs(el.expiredDated).diff(dayjs(batch.expiredDated)) ==
                      0 && dayjs(batch.buyDate).diff(dayjs(el.buyDate)) == 0
                );

                dailyBusiness.expenses[index2].cost +=
                  batch.quantity * FFAD.batch[index3].buyPrice;
                dailyBusiness.totalExpenses +=
                  batch.quantity * FFAD.batch[index3].buyPrice;
              }
            }
          }

          if (index2 == -1) {
            const expenseObject = {
              name: food.object.name,
              amount: food.quantity,
              cost: 0,
              kind: "FastFoodAndDrink",
            };
            for (batch of food.batchInfo) {
              if (batch.quantity != 0) {
                const index3 = FFAD.batch.findIndex(
                  (el) =>
                    dayjs(el.expiredDated).diff(dayjs(batch.expiredDated)) ==
                      0 && dayjs(batch.buyDate).diff(dayjs(el.buyDate)) == 0
                );

                expenseObject.cost +=
                  FFAD.batch[index3].buyPrice * batch.quantity;
                dailyBusiness.totalExpenses +=
                  batch.quantity * FFAD.batch[index3].buyPrice;
              }
            }
            dailyBusiness.expenses.push(expenseObject);
          }
        }
      }
    }
    dailyBusiness.status = "waitingConfirm";
    await dailyBusiness.save();
    console.log("Done clean up orders, and calculate loss");
  } catch (err) {
    console.log(err);
  }
}

function endOfDayCalculatingBusinessSchedule() {
  var cronExpress = "0 0 6 * * *";
  schedule.scheduleJob(cronExpress, async function () {
    endOfDayCalculatingBusiness();
  });
}

module.exports.endOfDayCalculatingBusinessSchedule =
  endOfDayCalculatingBusinessSchedule;
module.exports.endOfDayCalculatingBusiness = endOfDayCalculatingBusiness;
