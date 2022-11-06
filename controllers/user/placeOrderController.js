const Orders = require("../../Model/orders");
const Users = require("../../Model/user");

// const moment = require("moment-timezone");
// const now = moment.tz(new Date(), "Asia/Ho_Chi_Minh").toString();
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
    //is AllowPending
    let status = false;
    let statusCode = 0;
    let email = "";
    if (req.userId) {
      status = "trusted";
      statusCode = 1;
      user = await Users.findById(req.userId);
      email = user.email;
    } else {
      status = "onsite";
      statusCode = 2;
    }
    // place order
    let cost = 0;
    //Time arrive
    const arrive_at = req.body.arrive_at;

    const orderModel = new Orders({
      user: req.userId,
      order: order,
      cost: 0,
      status: status,
      statusCode: statusCode,
      email: email,
      created_at: new Date(),
      arrive_at: statusCode == 2 ? new Date() : new Date(arrive_at),
    });

    await orderModel.populate("order.object");
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
