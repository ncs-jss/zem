const getTimeInGMT = ({ hour, minute }) => {
  let gmt_hour = hour - 5;
  let gmt_minute = minute - 30;
  if(gmt_minute < 0) {
    gmt_hour -= 1;
    gmt_minute += 60;
  }
  return { gmt_hour, gmt_minute };
}

const time_formatter = ({ hour, minute }) => {
  hour = String(hour);
  minute = String(minute);

  if(hour.length < 2) {
    hour = '0' + hour;
  }

  if(minute.length < 2) {
    minute = '0' + minute;
  }

  return `${hour}:${minute}`;
}

module.exports = {
  getTimeInGMT,
  time_formatter
}
