const fastFoodAndDrink = require("../../Model/fastFoodAndDrink");

const addFastMultipleFoodAndDrink = async (req, res, next) => {
  try {
    //Validator
    const arrayOfFastFood = req.body.arrayOfFastFood;
    const arrErrors = [];
    const dbRes = [];
    let index = 0;
    //Take out sent information
    for (const FastFood of arrayOfFastFood) {
      index++;
      const name = FastFood.name;
      const price = FastFood.price;
      const amount = FastFood.amount;
      const imgUrl = FastFood.imgUrl;
      //name too long
      if (name.length > 40) {
        const error = new Error(`Tên của món thứ ${index} quá dài !`);
        arrErrors.push(error);
      }
      //Price
      if (price < 0) {
        const error = new Error(`Số tiền của món thứ ${index} không thể < 0 !`);
        arrErrors.push(error);
      }
      // amount <=0
      if (amount <= 0) {
        const error = new Error(
          `Số lượng của món thứ ${index} không thể < 0 !`
        );
        arrErrors.push(error);
      }
      //Find Name already exit
      const exist = await fastFoodAndDrink.exists({ name: name });
      if (exist) {
        const error = new Error(`Mặt hàng thứ ${index + 1} này đã tồn tại !`);
        arrErrors.push(error);
      }
      if (arrErrors.length == 0) {
        // Add fastFoodAndDrink
        const a = new fastFoodAndDrink({
          name: name,
          price: price,
          amountAvailable: amount,
          imgUrl: imgUrl,
        });
        const res = await a.save();
        dbRes.push(res);
      }
    }
    if (arrErrors.length != 0) {
      throw arrErrors.map((e) => e.message);
    }
    res.status(200).json({
      content: dbRes,
      ok: true,
    });
  } catch (err) {
    res.status(422).json({
      content: err,
    });
  }
};

module.exports = addFastMultipleFoodAndDrink;
