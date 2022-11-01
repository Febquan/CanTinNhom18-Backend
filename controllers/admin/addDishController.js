const Dish = require("../../Model/dish");

exports.AddDish = async (req, res, next) => {
  try {
    //
    const name1 = "Cơm chiên";
    //Find Name already exit
    const exist = await Dish.exists({ name: name1 });
    if (exist) {
      res.status(400).json({
        message: "Món ăn này đã tồn tại !",
      });
      return;
    }
    // Add dish
    const a = new Dish({ name: name1, price: 20000 });
    const dbRes = await a.save();

    res.status(200).json({
      content: dbRes,
    });
  } catch (err) {
    console.log(err);
  }
};
