const DailyBusinessModel = require("../../Model/dailyBusiness");
const dayjsSG = require("../../utils/dayjsSaiGonTimeZone");
const findDailyBusiness = async (req, res, next) => {
  try {
    const status = req.body.status;
    const atTime = req.body.atTime;
    const notStatus = req.body.notStatus;
    const inDuration = req.body.inDuration; // day  month  year

    const findOption = {};
    if (status) {
      findOption.status = status;
    }
    if (notStatus) {
      findOption.status = { $ne: notStatus };
    }
    if (atTime && inDuration) {
      findOption.date = {
        $gte: dayjsSG(atTime).startOf(inDuration),
        $lte: dayjsSG(atTime).endOf(inDuration),
      };
    }
    const dbRes = await DailyBusinessModel.find(findOption);
    res.status(200).json({
      content: dbRes,
      ok: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = findDailyBusiness;
