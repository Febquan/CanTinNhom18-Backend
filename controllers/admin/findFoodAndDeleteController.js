const ExtraFoodModel = require("../../Model/extraFood");
const DishModel = require("../../Model/dish");
const findFoodAndDelete = async (req, res, next) => {
  try {
    const foodId = req.body.foodId;
    const type = req.body.type;

    let DeletedFood = null;

    if (type == "Dish") {
      const existFoodInSomeOrders = await OrdersModel.findOne({
        order: { $elemMatch: { object: { _id: foodId } } },
      });

      if (existFoodInSomeOrders) {
        throw new Error(
          "Sản phẩm đã được đặt hàng trong đơn hàng vui lòng xử lý đơn hàng"
        );
      }

      DeletedFood = await DishModel.findByIdAndDelete({ _id: foodId });
    }
    if (type == "ExtraFood") {
      const existFoodInSomeOrders = await OrdersModel.findOne({
        order: {
          $elemMatch: {
            extraFood: { $elemMatch: { object: { _id: foodId } } },
          },
        },
      });

      if (existFoodInSomeOrders) {
        throw new Error(
          "Sản phẩm đã được đặt hàng trong đơn hàng vui lòng xử lý đơn hàng"
        );
      }

      DeletedFood = await ExtraFoodModel.findByIdAndDelete({ _id: foodId });
    }

    res.status(200).json({
      content: DeletedFood,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findFoodAndDelete;
