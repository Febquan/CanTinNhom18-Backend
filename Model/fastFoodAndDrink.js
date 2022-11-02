const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FFADSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  imgUrl: {
    type: String,
    default:
      "https://img.freepik.com/premium-vector/fast-food-seamless-pattern-with_202271-545.jpg?w=740",
  },
  price: {
    type: Number,
    require: true,
  },
  amountAvailable: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("FastFoodAnhDrink", FFADSchema);
