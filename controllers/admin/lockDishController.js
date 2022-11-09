const Dish = require("../../Model/dish");
const io = require("../../utils/getSocketConnection");
const completeOrdersController = async (req, res, next) => {
  try {
    const dishId = req.body.dishId;
    io.getIO().emit("DishIsLock", { dishLock: dishId });
    const lockDish = await Dish.findOneAndUpdate(
      { _id: dishId },
      { isAvailable: false }
    );
    res.status(200).json({
      content: lockDish,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = completeOrdersController;
