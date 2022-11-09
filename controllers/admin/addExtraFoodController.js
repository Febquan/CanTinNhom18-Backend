const extraFoodModel = require("../../Model/extraFood");

const addExtraFood = async (req, res, next) => {
  try {
    //Take out sent information
    const name = req.body.name;
    const price = req.body.price;
    const imgUrl = req.body.imgUrl;

    //price <0
    if (price < 0) {
      const error = new Error(`Số tiền không thể < 0 !`);
      error.statusCode = 422;
      throw error;
    }
    //Find Name already exit
    const exist = await extraFoodModel.exists({ name: name });
    if (exist) {
      const error = new Error("Mặt hàng này đã tồn tại !");
      error.statusCode = 400;
      throw error;
    }
    // Add fastFoodAndDrink
    const a = new extraFoodModel({
      name: name,
      price: price,
      imgUrl: imgUrl,
    });

    const dbRes = await a.save();

    res.status(200).json({
      content: dbRes,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = addExtraFood;
