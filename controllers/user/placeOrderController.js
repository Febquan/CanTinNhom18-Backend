const Orders = require("../../Model/orders");

exports.placeOrder = async (req, res, next) => {
  try {
    //Take out sent information
    const dishesIds = req.body.dishes;
    //Validation
    if (dishesIds.length === 0) {
      throw new Error("Chưa có sản phẩm nào được nhập !");
    }
    // place order
    let cost = 0;
    const order = new Orders({ dishes: dishesIds, cost: 0 });

    await order.populate("dishes.type");
    cost = order.dishes.reduce(
      (sum, cur) => sum + cur.type.price * cur.quantity,
      0
    );
    order.cost = cost;
    const dbRes = await order.save();

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
