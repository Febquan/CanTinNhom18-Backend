const Orders = require("../../Model/orders");
const Users = require("../../Model/user");
const FastFoodAndDrink = require("../../Model/fastFoodAndDrink");
const Dish = require("../../Model/dish");
const ExtraFood = require("../../Model/extraFood");
const roundTime = require("../../utils/roundTime");
const mailer = require("../../utils/mailer");
const io = require("../../utils/getSocketConnection");
const adminSockets = require("../../utils/adminSocket");
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
    let status = req.body.status;
    let arrive_at = "";
    if (req.userId) {
      status = "trusted";
      user = await Users.findById(req.userId);
      //Time arrive
      arrive_at = req.body.arrive_at;
    }
    //check Email
    if (status === "onSite" && req.body.email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(req.body.email.toLowerCase())) {
        const error = new Error("Email không hợp lệ !");
        error.statusCode = 422;
        throw error;
      }
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
      if (food.kind === "Dish") {
        let temp = await Dish.findById(food.object._id);
        if (!temp.isAvailable) {
          const error = new Error(`Món ${temp.name} đã hết hàng ! `);
          error.statusCode = 422;
          throw error;
        }
        for (extraFood of food.extraFood) {
          temp = await ExtraFood.findById(extraFood.object._id);
          if (!temp.isAvailable) {
            const error = new Error(`Món ${temp.name} đã hết hàng ! `);
            error.statusCode = 422;
            throw error;
          }
        }
      }
    }
    // place order

    let cost = 0;
    const orderModel = new Orders({
      user: req.userId,
      order: order,
      cost: 0,
      description: req.body.description,
      onSite: req.body.onSite,
      status: status,
      email: req.body.email,
      created_at: new Date(),
      arrive_at: roundTime(arrive_at, 15),
    });

    await orderModel.populate("order.object");
    await orderModel.populate("order.extraFood.object");
    await orderModel.populate("user");
    //calculate cost
    cost = orderModel.order.reduce(
      (sum, cur) =>
        sum +
        cur.object.price * cur.quantity +
        cur.extraFood.reduce(
          (sum, cur) => sum + cur.object.price * cur.quantity,
          0
        ),
      0
    );
    orderModel.cost = cost;
    const QueueChangeData = orderModel;
    const dbRes = await orderModel.save();

    //sendMail to unAuth user
    if (status === "onSite" && req.body.email) {
      mailer(
        dbRes.email,
        `Căn tin nhóm 18: Đơn hàng mã ${dbRes._id} `,
        `<h2>Xin vui lòng click vào <a href="${process.env.FRONT_END_URL}/user/watchMyOrderAuth/${dbRes.email}">đường link này</a> để theo dõi đơn hàng của bạn</h2>
        
        `
      );
    }
    //socket add
    adminSockets.getAdminSocketIds().forEach((socket) => {
      io.getIO().to(socket).emit("QueueChange", {
        message: "OrderAdded",
        content: QueueChangeData,
      });
    });
    res.status(200).json({
      content: dbRes,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = placeOrder;
