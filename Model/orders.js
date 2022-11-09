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
    type: String, //onsite , paid ,trusted ,waiting, doing
    require: true,
  },
  onSite: {
    type: Boolean,
    require: true,
    default: true,
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
          type: Schema.Types.ObjectId,
          ref: "ExtraFood",
        },
      ],
      quantity: Number,
      _id: false,
    },
  ],
  created_at: { type: Date, require: true },
  arrive_at: { type: Date, require: true },
});

module.exports = mongoose.model("Orders", orderSchema);
