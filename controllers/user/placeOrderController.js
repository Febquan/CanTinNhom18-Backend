const Orders = require("../../Model/orders");

exports.placeOrder = async (req, res, next) => {
  try {
    //Take out sent information
    const order = req.body.order;
    //Validation
    if (order.length === 0) {
      const error = new Error("Chưa có sản phẩm nào được nhập !");
      error.statusCode = 422;
      throw error;
    }
    // place order
    let cost = 0;
    const orderModel = new Orders({ order: order, cost: 0 });
    await orderModel.populate("order.object");
    console.log(orderModel);
    //calculate cost
    cost = orderModel.order.reduce(
      (sum, cur) => sum + cur.object.price * cur.quantity,
      0
    );
    orderModel.cost = cost;
    const dbRes = await orderModel.save();

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
