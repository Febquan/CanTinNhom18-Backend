const dayjsSG = require("./../utils/dayjsSaiGonTimeZone");
module.exports = function isToday(dateString) {
  return (
    dayjsSG().get("year") === dayjsSG(dateString).get("year") &&
    dayjsSG().get("month") === dayjsSG(dateString).get("month") &&
    dayjsSG().get("date") === dayjsSG(dateString).get("date")
  );
};
