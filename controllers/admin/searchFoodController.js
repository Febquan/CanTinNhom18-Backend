const DishModel = require("../../Model/dish");
const ExtraFoodModel = require("../../Model/extraFood");
const foodSearch = async (req, res, next) => {
  try {
    const Search = req.body.search;
    if (!Search) {
      throw new Error("Bạn chưa nhập gì cả");
    }
    let resultDish = await DishModel.find();
    let resultExtraFood = await ExtraFoodModel.find();
    resultDish = resultDish
      .filter((Dish) =>
        Dish.name.toLowerCase().includes(Search.toLowerCase().trim())
      )
      .map((el) => ({ ...el._doc, type: "Dish" }));
    resultExtraFood = resultExtraFood
      .filter((ExtraFood) =>
        ExtraFood.name.toLowerCase().includes(Search.toLowerCase().trim())
      )
      .map((el) => ({ ...el._doc, type: "ExtraFood" }));

    const result = [...resultDish, ...resultExtraFood];
    if (result.length == 0) {
      throw new Error("Không tìm thấy sản phẩm này trong kho");
    }
    res.status(200).json({
      content: result,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = foodSearch;
