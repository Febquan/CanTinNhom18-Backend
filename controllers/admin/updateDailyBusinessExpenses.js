const DailyBusinessModel = require("../../Model/dailyBusiness");

const updateDailyBusinessExpenses = async (req, res, next) => {
  try {
    const dailyBusinessId = req.body.dailyBusinessId;
    const expenses = req.body.expenses;
    const totalExpense = req.body.totalExpense;
    const dailyBusiness = await DailyBusinessModel.findOne({
      _id: dailyBusinessId,
    });
    dailyBusiness.status =
      dailyBusiness.status == "waitingConfirm"
        ? "waitingConfirm"
        : "uncompleted";
    dailyBusiness.loss = expenses.filter((el) => el.kind != "FastFoodAndDrink");
    dailyBusiness.totalLoss = 0;
    dailyBusiness.expenses = expenses.filter(
      (el) => el.kind != "FastFoodAndDrink"
    );
    dailyBusiness.totalExpenses = totalExpense;
    dailyBusiness.totalLoss = expenses
      .filter((el) => el.kind != "FastFoodAndDrink")
      .reduce((sum, cur) => sum + cur.cost, 0);
    console.log(
      dailyBusiness.totalLoss,
      expenses.filter((el) => el.kind == "Dish")
    );
    dailyBusiness.status = "uncompleted";
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
