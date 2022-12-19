const express = require("express");
const router = express.Router();

const findDailyBusinessController = require("../../controllers/admin/findDailyBusiness");
const updateDailyBusinessExpensesController = require("../../controllers/admin/updateDailyBusinessExpenses");
const endOfDayCalculatingController = require("../../controllers/admin/dailyBusinessCalculatingController");
const setDailyBusinessStatusController = require("../../controllers/admin/setDailyBusinessStatusController");
router.post("/findDailyBusiness", findDailyBusinessController);
router.post(
  "/updateDailyBusinessExpenses",
  updateDailyBusinessExpensesController
);
router.post("/endOfDayCalculating", endOfDayCalculatingController);
router.post("/setDailyBusinessStatus", setDailyBusinessStatusController);

module.exports = router;
