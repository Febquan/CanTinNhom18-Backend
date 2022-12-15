const dayjs = require("dayjs");
module.exports = function isToday(dateString) {
  return (
    dayjs().get("year") === dayjs(dateString).get("year") &&
    dayjs().get("month") === dayjs(dateString).get("month") &&
    dayjs().get("date") === dayjs(dateString).get("date")
  );
};
