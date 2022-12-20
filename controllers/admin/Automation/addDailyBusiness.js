const dayjs = require("dayjs");
const dailyBusinessModel = require("../../../Model/dailyBusiness");
const schedule = require("node-schedule");

function addDailyBusiness() {
  let rule = new schedule.RecurrenceRule();
  rule.tz = "Asia/Saigon";
  rule.second = 0;
  rule.minute = 0;
  rule.hour = 0;
  schedule.scheduleJob(rule, async function () {
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
