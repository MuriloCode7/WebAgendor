const moment = require("moment");

module.exports = {
  SLOT_DURATION: 30,
  isOpened: async (timeTables) => {},
  toCents: (price) => {
    return parseInt(price.toString().replace(".", "").replace(",", ""));
  },

  hourToMinutes: (hourMinute) => {
    const [hours, minutes] = hourMinute.split(":");
    return parseInt(parseInt(hours) * 60 + parseInt(minutes));
  },

  sliceMinutes: (start, end, duration) => {
    let slices = [];

    start = moment(start);
    end = moment(end);

    while (end > start) {
      slices.push(start.format("HH:mm"));
      start = start.add(duration, "minutes");
    }
    return slices;
  },

  mergeDateTime: (date, time) => {
    const merged = `${moment(date).format("YYYY-MM-DD")}T${moment(time).format(
      "HH:mm"
    )}`;
    return merged;
  },
};
