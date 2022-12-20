const dayjs = require("dayjs");
const schedule = require("node-schedule");
const DishModel = require("./../../../Model/dish");
const ExtraFoodModel = require("./../../../Model/extraFood");
const ordersModel = require("./../../../Model/orders");
const DailyBusinessModel = require("../../../Model/dailyBusiness");

const dayjsSG = require("../../../utils/dayjsSaiGonTimeZone");

function counter(accumulator, cur) {
  const index = accumulator.findIndex((el) => {
    return el._id.toString() == cur.object._id.toString();
  });

  if (index != -1) {
    accumulator[index].quantity += cur.quantity;
  }
  if (index == -1) {
    accumulator.push({ _id: cur.object._id, quantity: cur.quantity });
  }
  return accumulator;
}

function setScheduleUpdatingDailyFoodAmount() {
  let rule = new schedule.RecurrenceRule();
  rule.tz = "Asia/Saigon";
  rule.second = 0;
  rule.minute = 0;
  rule.hour = 0;

  schedule.scheduleJob(rule, async function () {
    try {
      const dishes = await DishModel.find();

      const extraFoods = await ExtraFoodModel.find();

      todayOrders = await ordersModel.find({
        arrive_at: {
          $gte: dayjsSG().startOf("day"),
          $lte: dayjsSG().endOf("day"),
        },
      });

      //add expense to daily business
      const dailyBusiness = await DailyBusinessModel.findOne({
        date: {
          $gte: dayjsSG().startOf("day"),
          $lte: dayjsSG().endOf("day"),
        },
      });
      for (dish of dishes) {
        if (dish.everyDayAmount > 0) {
          dailyBusiness.expenses.push({
            name: dish.name,
            amount: dish.everyDayAmount,
            cost: 0,
            kind: "Dish",
          });
        }
      }
      for (extraFood of extraFoods) {
        if (extraFood.everyDayAmount > 0) {
          dailyBusiness.expenses.push({
            name: extraFood.name,
            amount: extraFood.everyDayAmount,
            cost: 0,
            kind: "ExtraFood",
          });
        }
      }
      await dailyBusiness.save();
      //preOrder
      const preOrderDish = todayOrders
        .map((el) => el.order)
        .flat()
        .filter((item) => item.kind == "Dish");
      const preOrderExtraFood = preOrderDish.map((el) => el.extraFood).flat();
      const preOrderDishAndQuantity = preOrderDish.reduce(counter, []);
      const preOrderExtraFoodAndQuantity = preOrderExtraFood.reduce(
        counter,
        []
      );
      for ([index, dish] of dishes.entries()) {
        dishes[index].amountAvailable = dish.everyDayAmount;
        const preOrder = preOrderDishAndQuantity.find(
          (el) => el._id.toString() == dish._id.toString()
        );
        if (preOrder) {
          dishes[index].amountAvailable -= preOrder.quantity;
        }
        await dishes[index].save();
      }
      for ([index, extraFood] of extraFoods.entries()) {
        extraFoods[index].amountAvailable = extraFood.everyDayAmount;
        const preOrder = preOrderExtraFoodAndQuantity.find(
          (el) => el._id.toString() == extraFood._id.toString()
        );
        if (preOrder) {
          extraFoods[index].amountAvailable -= preOrder.quantity;
        }
        await extraFoods[index].save();
      }

      console.log("Done updating the daily amount");
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = setScheduleUpdatingDailyFoodAmount;
