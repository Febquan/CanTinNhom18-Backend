const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const completeOrdersSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  cost: {
    type: Number,
  },
  email: {
    type: String,
    require: true,
  },
  status: {
    type: String, //onsite  ,trusted
    require: true,
  },

  order: [
    {
      kind: String,
      object: {
        type: Schema.Types.ObjectId,
        refPath: "order.kind",
      },
      extraFood: [
        {
          object: {
            type: Schema.Types.ObjectId,
            ref: "ExtraFood",
          },
          quantity: { type: Number, default: 1 },
        },
      ],
      quantity: { type: Number, default: 1 },
      _id: false,
    },
  ],
  pay_at: { type: Date, require: true },
});

module.exports = mongoose.model("CompleteOrders", completeOrdersSchema);
