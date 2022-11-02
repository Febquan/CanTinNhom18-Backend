const { validationResult } = require("express-validator");
const fastFoodAndDrink = require("../../Model/fastFoodAndDrink");

exports.addFastFoodAndDrink = async (req, res, next) => {
  try {
    //Validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.errors[0].msg);
      error.statusCode = 422;
      throw error;
    }
    //Take out sent information
    const name = req.body.name;
    const price = req.body.price;
    const amount = req.body.amount;
    const imgUrl = req.body.imgUrl;
    // amount <=0
    if (amount <= 0) {
      const error = new Error("Số lượng không thể < 0 !");
      error.statusCode = 422;
      throw error;
    }
    //price <0
    if (price < 0) {
      const error = new Error(`Số tiền không thể < 0 !`);
      error.statusCode = 422;
      throw error;
    }
    //Find Name already exit
    const exist = await fastFoodAndDrink.exists({ name: name });
    if (exist) {
      const error = new Error("Mặt hàng này đã tồn tại !");
      error.statusCode = 400;
      throw error;
    }
    // Add fastFoodAndDrink
    const a = new fastFoodAndDrink({
      name: name,
      price: price,
      amountAvailable: amount,
      imgUrl: imgUrl,
    });

    const dbRes = await a.save();

    res.status(200).json({
      content: dbRes,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
