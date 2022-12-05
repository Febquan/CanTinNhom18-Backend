const fastFoodAndDrinkModel = require("../../Model/fastFoodAndDrink");

const seeFastFoodAndDrink = async (req, res, next) => {
  try {
    const fastFoodAndDrink = await fastFoodAndDrinkModel.find();

    res.status(200).json({
      content: fastFoodAndDrink,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = seeFastFoodAndDrink;
