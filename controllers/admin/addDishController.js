const { validationResult } = require("express-validator");
const Dish = require("../../Model/dish");

exports.AddDish = async (req, res, next) => {
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
    //Find Name already exit
    const exist = await Dish.exists({ name: name });
    if (exist) {
      const error = new Error("Món ăn này đã tồn tại !");
      error.statusCode = 400;
      throw error;
    }
    // Add dish
    const a = new Dish({ name: name, price: price });
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
