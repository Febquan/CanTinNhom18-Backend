const { validationResult } = require("express-validator");
const fastFoodAndDrink = require("../../Model/fastFoodAndDrink");

const addFastFoodAndDrink = async (req, res, next) => {
  try {
    //Validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.errors[0].msg);
      error.statusCode = 422;
      throw error;
    }
    //Take out sent information
    const name = req.body.name;
    const price = req.body.price;
    const isDrink = req.body.isDrink;
    const imgUrl = req.body.imgUrl;
    const buyPrice = req.body.buyPrice;
    const initialQuantity = req.body.amount;
    //batch
    const amount = req.body.amount;
    const expiredDated = req.body.expiredDated;
    // amount <=0
    if (amount <= 0) {
      const error = new Error("Số lượng không thể < 0 !");
      error.statusCode = 422;
      throw error;
    }
    //price <0
    if (price < 0) {
      const error = new Error(`Số tiền không thể < 0 !`);
      error.statusCode = 422;
      throw error;
    }
    if (buyPrice < 0) {
      const error = new Error(`Số tiền không thể < 0 !`);
      error.statusCode = 422;
      throw error;
    }
    //Find Name already exit
    let dbRes = null;
    const exist = await fastFoodAndDrink.findOne({ name: name });
    if (exist) {
      exist.batch.push({
        quantity: amount,
        expiredDated,
        buyDate: Date(),
        buyPrice,
        initialQuantity,
      });
      dbRes = await exist.save();
    }
    if (!exist) {
      const a = new fastFoodAndDrink({
        name: name,
        price: price,
        batch: [
          {
            quantity: amount,
            expiredDated,
            buyPrice,
            initialQuantity,
            buyDate: Date(),
          },
        ],
        imgUrl: imgUrl,
        isDrink: isDrink,
      });

      dbRes = await a.save();
    }

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

module.exports = addFastFoodAndDrink;
