const EndOfDayCalculating = require("./Automation/EndOfDayCalculatingDaily");

const businessCalculating = async (req, res, next) => {
  try {
    await EndOfDayCalculating.endOfDayCalculatingBusiness();
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

module.exports = businessCalculating;
