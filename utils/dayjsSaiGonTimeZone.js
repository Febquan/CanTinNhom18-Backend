const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);
module.exports = function dayjsSaiGonTimeZone(time) {
  return dayjs(time).tz("Asia/Saigon");
};
