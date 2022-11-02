const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  cost: {
    type: Number,
  },
  dishes: [
    {
      type: {
        type: Schema.Types.ObjectId,
        ref: "Dish",
      },
      quantity: Number,
      _id: false,
    },
  ],
});

module.exports = mongoose.model("Orders", orderSchema);
