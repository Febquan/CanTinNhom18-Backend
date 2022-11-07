const Orders = require("../../Model/orders");
const Users = require("../../Model/user");
const FastFoodAndDrink = require("../../Model/fastFoodAndDrink");
const roundTime = require("../../utils/roundTime");
const mailer = require("../../utils/mailer");
// const moment = require("moment-timezone");
// const now = moment.tz(new Date(), "Asia/Ho_Chi_Minh").toString();
const placeOrder = async (req, res, next) => {
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

    let email = "";

    if (req.userId) {
      status = "trusted";
      user = await Users.findById(req.userId);
      //Time arrive
      var arrive_at = req.body.arrive_at;
    } else {
      status = "onsite";
      if (!req.body.email) {
        const error = new Error("Bạn chưa điền Email !");
        error.statusCode = 422;
        throw error;
      }
      email = req.body.email;
    }

    //Check FastFoodAndDrink available
    for (food of order) {
      if (food.kind === "FastFoodAndDrink") {
        const temp = await FastFoodAndDrink.findById(food.object._id);
        if (temp.amountAvailable < food.quantity) {
          const error = new Error(
            `Sản phẩm ${temp.name} này chỉ còn lại ${temp.amountAvailable} so với số lượng cần là ${food.quantity} !`
          );
          error.statusCode = 422;
          throw error;
        }
        temp.amountAvailable = temp.amountAvailable - food.quantity;
        await temp.save();
      }
    }
    // place order
    let cost = 0;
    const orderModel = new Orders({
      user: req.userId,
      order: order,
      cost: 0,
      status: status,
      email: status == "onsite" ? email : null,
      created_at: new Date(),
      arrive_at:
        status == "onsite"
          ? roundTime(undefined, 15)
          : roundTime(arrive_at, 15),
    });

    await orderModel.populate("order.object");
    //calculate cost
    cost = orderModel.order.reduce(
      (sum, cur) => sum + cur.object.price * cur.quantity,
      0
    );
    orderModel.cost = cost;
    const dbRes = await orderModel.save();

    //sendMail to unAuth user
    if (status === "onsite") {
      mailer(
        dbRes.email,
        `Căn tin nhóm 18: Đơn hàng mã ${dbRes._id} `,
        `<h2>Xin vui lòng click vào <a href="http://localhost:8080/user/watchMyOrderAuth/${dbRes.email}">đường link này</a> để theo dõi đơn hàng của bạn</h2>
        
        `
      );
    }

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

module.exports = placeOrder;
