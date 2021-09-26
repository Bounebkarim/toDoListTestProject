exports.getDate = getDate();
function getDate() {
  let today = new Date();
  let day = "";
  let options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  day = today.toLocaleDateString("en-BZ", options);
  return day;
}
exports.getDay = getDay();
function getDay() {
  let today = new Date();
  let day = "";
  let options = {
    weekday: "long",
  };
  day = today.toLocaleDateString("en-BZ", options);
  return day;
}
