const DailyBusinessModel = require("../../Model/dailyBusiness");

const updateDailyBusinessExpenses = async (req, res, next) => {
  try {
    const dailyBusinessId = req.body.dailyBusinessId;
    const expenses = req.body.expenses;
    const totalExpense = req.body.totalExpense;
    const dailyBusiness = await DailyBusinessModel.findOne({
      _id: dailyBusinessId,
    });
    dailyBusiness.status = "uncompleted";
    dailyBusiness.loss = [];
    dailyBusiness.totalLoss = 0;
    dailyBusiness.expenses = expenses;
    dailyBusiness.totalExpenses = totalExpense;
    await dailyBusiness.save();
    res.status(200).json({
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = updateDailyBusinessExpenses;
