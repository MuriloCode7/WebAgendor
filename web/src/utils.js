const utils = {
  hourToMinutes: (hourMinute) => {
    const [hours, minutes] = hourMinute.split(":");
    return parseInt(parseInt(hours) * 60 + parseInt(minutes));
  },
}

export default utils;