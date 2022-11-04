const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  cost: {
    type: Number,
  },
  order: [
    {
      kind: String,
      object: {
        type: Schema.Types.ObjectId,
        refPath: "order.kind",
      },
      quantity: Number,
      _id: false,
    },
  ],
});

module.exports = mongoose.model("Orders", orderSchema);
