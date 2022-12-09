const DishModel = require("../../Model/dish");
const ExtraFoodModel = require("../../Model/extraFood");
const FFADModel = require("../../Model/fastFoodAndDrink");
const findDishAndUpdate = async (req, res, next) => {
  try {
    const foodId = req.body.foodId;
    const isAvailable = req.body.isAvailable;
    const type = req.body.type;
    console.log(type);
    console.log(foodId);
    console.log(isAvailable);
    let updateAvailable = null;
    if (type == "Dish") {
      updateAvailable = await DishModel.findOneAndUpdate(
        { _id: foodId },
        { isAvailable: isAvailable }
      );
    }
    if (type == "ExtraFood") {
      updateAvailable = await ExtraFoodModel.findOneAndUpdate(
        { _id: foodId },
        { isAvailable: isAvailable }
      );
    }
    if (type == "FFAD") {
      updateAvailable = await FFADModel.findOneAndUpdate(
        { _id: foodId },
        { isAvailable: isAvailable }
      );
    }

    res.status(200).json({
      content: updateAvailable,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findDishAndUpdate;
