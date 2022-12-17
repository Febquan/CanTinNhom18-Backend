const updateDailyAmount = require("./../controllers/admin/Automation/updateDailyFoodAmount");
const addDailyBusiness = require("./../controllers/admin/Automation/addDailyBusiness");
const EndOfDayCalculatingDaily = require("../controllers/admin/Automation/EndOfDayCalculatingDaily");
function dailyUpdate() {
  updateDailyAmount();
  addDailyBusiness();
  EndOfDayCalculatingDaily.endOfDayCalculatingBusinessSchedule();
}

module.exports = dailyUpdate;
