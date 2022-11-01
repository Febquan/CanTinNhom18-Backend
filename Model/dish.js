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
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Ffast-food-background&psig=AOvVaw24fckRvSytLhXEz-w5fg66&ust=1667374985401000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCOCDzf-9jPsCFQAAAAAdAAAAABAE",
  },
  price: {
    type: Number,
    require: true,
  },
  isAvailable: {
    type: Boolean,
    require: true,
    default: true,
  },
});

module.exports = mongoose.model("Dish", dishesSchema);
