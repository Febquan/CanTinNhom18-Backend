const dayjs = require("dayjs");
const schedule = require("node-schedule");
const DishModel = require("./../../../Model/dish");
const ExtraFoodModel = require("./../../../Model/extraFood");
const ordersModel = require("./../../../Model/orders");

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
  var cronExpress = "0 0 0 * * *";

  schedule.scheduleJob(cronExpress, async function () {
    try {
      const dishes = await DishModel.find();

      const extraFoods = await ExtraFoodModel.find();

      todayOrders = await ordersModel.find({
        arrive_at: {
          $gte: dayjs().startOf("day"),
          $lte: dayjs().endOf("day"),
        },
      });

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
