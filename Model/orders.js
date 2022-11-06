const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
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
    type: String, //onsite , paid ,trusted
    require: true,
  },
  statusCode: {
    type: Number, //onsite , paid ,trusted
    require: true,
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
  created_at: { type: Date, require: true },
  arrive_at: { type: Date, require: true },
});

module.exports = mongoose.model("Orders", orderSchema);
