const dayjs = require("dayjs");
const DailyBusinessModel = require("../../Model/dailyBusiness");

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
        $gte: dayjs(atTime).startOf(inDuration),
        $lte: dayjs(atTime).endOf(inDuration),
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
