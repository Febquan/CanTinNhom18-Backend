const updateDailyAmount = require("./../controllers/admin/Automation/updateDailyFoodAmount");
const addDailyBusiness = require("./../controllers/admin/Automation/addDailyBusiness");

function dailyUpdate() {
  updateDailyAmount();
  addDailyBusiness();
}

module.exports = dailyUpdate;
