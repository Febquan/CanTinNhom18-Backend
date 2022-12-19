const DailyBusinessModel = require("../../Model/dailyBusiness");

const setDailyBusinessStatus = async (req, res, next) => {
  try {
    const status = req.body.status;
    const id = req.body.id;

    const findOption = {};
    findOption._id = id;

    const dailyBusiness = await DailyBusinessModel.findOne(findOption);
    dailyBusiness.status = status;
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

module.exports = setDailyBusinessStatus;
