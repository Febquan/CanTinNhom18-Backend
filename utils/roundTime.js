function roundTime(date, minutesToRound) {
  var timeToReturn = date ? new Date(date) : new Date();

  timeToReturn.setMilliseconds(0);
  timeToReturn.setSeconds(0);
  timeToReturn.setMinutes(
    Math.floor(timeToReturn.getMinutes() / minutesToRound) * minutesToRound
  );
  return timeToReturn;
}
module.exports = roundTime;
