const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dishesSchema = new Schema({
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
  info: {
    type: String,
    require: true,
  },
  isAvailable: {
    type: Boolean,
    require: true,
    default: true,
  },
});

module.exports = mongoose.model("Dish", dishesSchema);
