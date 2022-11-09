const Dish = require("../../Model/dish");
const ExtraFood = require("../../Model/extraFood");
const FastFoodAndDrink = require("../../Model/fastFoodAndDrink");

seeAllFoodController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const dish = await Dish.find();
    const extraFood = await ExtraFood.find();
    const fastFoodAndDrink = await FastFoodAndDrink.find();

    res.status(200).json({
      orders: {
        dish,
        extraFood,
        fastFoodAndDrink,
      },
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
module.exports = seeAllFoodController;
