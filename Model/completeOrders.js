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
  statusCode: {
    type: Number, //2,1
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
  created_at: { type: Date, require: true },
});

module.exports = mongoose.model("CompleteOrders", completeOrdersSchema);
