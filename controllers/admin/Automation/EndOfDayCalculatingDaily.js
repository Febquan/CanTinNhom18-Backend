const dayjs = require("dayjs");
const DailyBusinessModel = require("../../../Model/dailyBusiness");
const OrdersModel = require("../../../Model/orders");
const FFADModel = require("../../../Model/fastFoodAndDrink");
const DishModel = require("../../../Model/dish");
const ExtraFoodModel = require("../../../Model/extraFood");
const CompleteOrdersModel = require("../../../Model/completeOrders");
const schedule = require("node-schedule");
const checkToday = require("../../../utils/isToday");

const extraFood = require("../../../Model/extraFood");

const dayjsSG = require("../../../utils/dayjsSaiGonTimeZone");
async function endOfDayCalculatingBusiness(date = undefined) {
  try {
    const dailyBusiness = await DailyBusinessModel.findOne({
      date: {
        $gte: dayjsSG(date).startOf("day"),
        $lte: dayjsSG(date).endOf("day"),
      },
    });

    //Checking expenses is all not eaqual too 0
    let zero = false;
    for (item of dailyBusiness.expenses) {
      if (item.cost == 0) {
        zero = true;
      }
    }
    if (!zero) {
      if (dailyBusiness.status == "uncompleted") {
        const orderUnpaid = await OrdersModel.find({
          arrive_at: {
            $gte: dayjsSG(date).startOf("day"),
            $lte: dayjsSG(date).endOf("day"),
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
                    dayjs(el.expiredDated).diff(dayjs(batch.expiredDated)) ==
                      0 && dayjs(batch.buyDate).diff(dayjs(el.buyDate)) == 0
                );

                FFAD.batch[index2].quantity =
                  FFAD.batch[index2].quantity + batch.quantity;
              }

              await FFAD.save();
            }
            if (item.kind === "Dish" && checkToday(orderU.arrive_at)) {
              const dishFound = await DishModel.findById(item.object._id);
              dishFound.amountAvailable =
                dishFound.amountAvailable + item.quantity;
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
      }

      //reset if reCalculate
      // if (
      //   dailyBusiness.status == "waitingConfirm" ||
      //   dailyBusiness.status == "invalidExpenses"
      // ) {
      dailyBusiness.totalLoss = dailyBusiness.expenses
        .filter((el) => el.kind != "FastFoodAndDrink")
        .reduce((sum, cur) => sum + cur.cost, 0);
      dailyBusiness.income = 0;
      dailyBusiness.loss = dailyBusiness.expenses.filter(
        (el) => el.kind != "FastFoodAndDrink"
      );
      dailyBusiness.selling = [];
      dailyBusiness.expenses = dailyBusiness.expenses.filter(
        (el) => el.kind != "FastFoodAndDrink"
      );
      dailyBusiness.totalExpenses = dailyBusiness.expenses.reduce(
        (sum, cur) => sum + cur.cost,
        0
      );
      // }

      //calculate income for FFAD
      //add to dailybusines

      const todayCompleteOrders = await CompleteOrdersModel.find({
        pay_at: {
          $gte: dayjsSG(date).startOf("day"),
          $lte: dayjsSG(date).endOf("day"),
        },
      })
        .populate("order.object")
        .populate("order.extraFood.object");

      for (todayCompleteOrder of todayCompleteOrders) {
        for (food of todayCompleteOrder.order) {
          ////////////////////////////////////////
          if (food.kind == "Dish") {
            const index4 = dailyBusiness.expenses.findIndex(
              (el) => el.name == food.object.name
            );
            if (index4 == -1) {
              continue;
            }
            const realDishPrice =
              dailyBusiness.expenses[index4].cost /
              dailyBusiness.expenses[index4].amount;

            dailyBusiness.totalLoss -= realDishPrice * food.quantity;
            dailyBusiness.income += food.object.price * food.quantity;

            const index5 = dailyBusiness.loss.findIndex(
              (el) => el.name == food.object.name
            );
            dailyBusiness.loss[index5].amount -= food.quantity;
            dailyBusiness.loss[index5].cost -= realDishPrice * food.quantity;

            const index6 = dailyBusiness.selling.findIndex(
              (el) => el.name == food.object.name
            );
            if (index6 == -1) {
              dailyBusiness.selling.push({
                name: food.object.name,
                amount: food.quantity,
                cost: food.object.price * food.quantity,
              });
            }
            if (index6 != -1) {
              dailyBusiness.selling[index6].amount += food.quantity;
              dailyBusiness.selling[index6].cost +=
                food.object.price * food.quantity;
            }
            for (extra of food.extraFood) {
              const index7 = dailyBusiness.expenses.findIndex(
                (el) => el.name == extra.object.name
              );
              if (index7 == -1) {
                continue;
              }
              const realExtraFoodPrice =
                dailyBusiness.expenses[index7].cost /
                dailyBusiness.expenses[index7].amount;

              dailyBusiness.totalLoss -= realExtraFoodPrice * extra.quantity;
              dailyBusiness.income += extra.object.price * extra.quantity;

              const index8 = dailyBusiness.loss.findIndex(
                (el) => el.name == extra.object.name
              );
              dailyBusiness.loss[index8].amount -= extra.quantity;
              dailyBusiness.loss[index8].cost -=
                realExtraFoodPrice * extra.quantity;

              const index9 = dailyBusiness.selling.findIndex(
                (el) => el.name == extra.object.name
              );
              if (index9 == -1) {
                dailyBusiness.selling.push({
                  name: extra.object.name,
                  amount: extra.quantity,
                  cost: extra.object.price * extra.quantity,
                });
              }
              if (index9 != -1) {
                dailyBusiness.selling[index9].amount += extra.quantity;
                dailyBusiness.selling[index9].cost +=
                  extra.object.price * extra.quantity;
              }
            }
          }

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
    }
    dailyBusiness.status = "waitingConfirm";
    if (zero == true) {
      dailyBusiness.status = "invalidExpenses";
      console.log("Invalid Expenses");
    }

    dailyBusiness.totalProfit =
      dailyBusiness.income - dailyBusiness.totalExpenses;

    await dailyBusiness.save();
    console.log("Done clean up orders, and calculate loss");
  } catch (err) {
    console.log(err);
  }
}

function endOfDayCalculatingBusinessSchedule() {
  let rule = new schedule.RecurrenceRule();
  rule.tz = "Asia/Saigon";
  rule.second = 0;
  rule.minute = 0;
  rule.hour = 18;

  schedule.scheduleJob(rule, async function () {
    endOfDayCalculatingBusiness();
  });
}

module.exports.endOfDayCalculatingBusinessSchedule =
  endOfDayCalculatingBusinessSchedule;
module.exports.endOfDayCalculatingBusiness = endOfDayCalculatingBusiness;
