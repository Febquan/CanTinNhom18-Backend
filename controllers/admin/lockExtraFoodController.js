const extraFoodModel = require("../../Model/extraFood");
const io = require("../../utils/getSocketConnection");
const completeOrdersController = async (req, res, next) => {
  try {
    const extraFoodId = req.body.extraFoodId;
    io.getIO().emit("LockChange", { extraFoodLock: extraFoodId });
    const extraFood = await extraFoodModel.findOne({ _id: extraFoodId });
    extraFood.isAvailable = !extraFood.isAvailable;
    await extraFood.save();
    res.status(200).json({
      content: extraFood,
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
