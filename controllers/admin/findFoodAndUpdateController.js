const ExtraFoodModel = require("../../Model/extraFood");
const DishModel = require("../../Model/dish");
const OrdersModel = require("../../Model/orders");
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const unlinkAsync = promisify(fs.unlink);
const findFoodAndUpdate = async (req, res, next) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const isAvailable = req.body.isAvailable;
    const amountAvailable = req.body.amountAvailable;
    const everyDayAmount = req.body.everyDayAmount;
    const type = req.body.type;
    let imgUrl = "";
    let info = "";
    let existFoodInSomeOrders = null;
    if (type == "Dish") {
      if (req.file) {
        imgUrl = process.env.APP_URL + "/" + req.file.path;
      }
      if (!req.file) {
        imgUrl = req.body.imgUrl;
      }
      info = req.body.info;
      const exist = await DishModel.exists({ name: name, _id: { $ne: id } });
      if (exist) {
        const error = new Error("Món ăn này đã tồn tại !");
        error.statusCode = 400;
        throw error;
      }

      await DishModel.findByIdAndUpdate(id, {
        name,
        price,
        isAvailable,
        imgUrl,
        amountAvailable,
        everyDayAmount,
        info,
      });
      if (req.file) {
        await unlinkAsync(
          path.join(__dirname, "..", "..", req.body.oldFilePath)
        );
      }

      existFoodInSomeOrders = await OrdersModel.find({
        order: { $elemMatch: { object: { _id: id } } },
      })
        .populate("order.object")
        .populate("order.extraFood.object");
    }

    if (type == "ExtraFood") {
      imgUrl = req.body.imgUrl;
      await ExtraFoodModel.findByIdAndUpdate(id, {
        name,
        price,
        isAvailable,
        imgUrl,
        amountAvailable,
        everyDayAmount,
      });

      //findOrderWithExtraFoodIn
      existFoodInSomeOrders = await OrdersModel.find({
        order: {
          $elemMatch: {
            extraFood: { $elemMatch: { object: { _id: id } } },
          },
        },
      })
        .populate("order.object")
        .populate("order.extraFood.object");
    }

    await Promise.all(
      existFoodInSomeOrders.map(async (order) => {
        order.cost = order.order.reduce(
          (sum, cur) =>
            sum +
            cur.object.price * cur.quantity +
            cur.extraFood.reduce(
              (sum, cur) => sum + cur.object.price * cur.quantity,
              0
            ),
          0
        );
        return await order.save();
      })
    );

    res.status(200).json({
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findFoodAndUpdate;
