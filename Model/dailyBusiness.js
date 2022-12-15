const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dailyBusinessSchema = new Schema({
  expenses: [
    {
      name: String,
      cost: Number,
      default: 0,
    },
  ],
  totalExpenses: {
    type: Number,
    default: 0,
  },
  totalProfit: {
    type: Number,
    default: 0,
  },
  income: {
    type: Number,
    default: 0,
  },
  totalLoss: {
    type: Number,
    default: 0,
  },
  status: {
    type: String, //complete, uncompleted
    require: true,
  },
  selling: [
    {
      name: String,
      amount: {
        type: Number,
        default: 0,
      },
      cost: {
        type: Number,
        default: 0,
      },
    },
  ],
  loss: [
    {
      name: String,
      amount: {
        type: Number,
        default: 0,
      },
      cost: {
        type: Number,
        default: 0,
      },
    },
  ],
  date: { type: Date, require: true },
});

module.exports = mongoose.model("dailyBusiness", dailyBusinessSchema);
