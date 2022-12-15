const dayjs = require("dayjs");
const dailyBusinessModel = require("../../../Model/dailyBusiness");
const schedule = require("node-schedule");

function addDailyBusiness() {
  var cronExpress = "0 0 0 * * *";
  schedule.scheduleJob(cronExpress, async function () {
    try {
      const newDailyBusiness = new dailyBusinessModel({
        date: dayjs(),
        status: "uncompleted",
      });
      await newDailyBusiness.save();
      console.log("Done adding new daily business");
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = addDailyBusiness;
