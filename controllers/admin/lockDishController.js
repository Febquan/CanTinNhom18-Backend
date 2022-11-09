const Dish = require("../../Model/dish");
const io = require("../../utils/getSocketConnection");
const completeOrdersController = async (req, res, next) => {
  try {
    const dishId = req.body.dishId;
    io.getIO().emit("LockChange", { dishLock: dishId });
    const lockDish = await Dish.findOne({ _id: dishId });
    lockDish.isAvailable = !lockDish.isAvailable;
    await lockDish.save();
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
