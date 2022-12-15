const ExtraFoodModel = require("../../Model/extraFood");
const DishModel = require("../../Model/dish");

const findFoodUpdateEveryDayAmount = async (req, res, next) => {
  try {
    const id = req.body.id;
    const amount = req.body.amount;

    const dish = await DishModel.findById(id);
    const extraFood = await ExtraFoodModel.findById(id);
    if (dish) {
      dish.everyDayAmount = amount;
      dish.save();
    }
    if (extraFood) {
      extraFood.everyDayAmount = amount;
      extraFood.save();
    }
    res.status(200).json({
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findFoodUpdateEveryDayAmount;
