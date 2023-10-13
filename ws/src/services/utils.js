const moment = require('moment');

module.exports = {
  isOpened: async(timeTables) => {},
  toCents: (price) => {
    return parseInt(price.toString().replace('.','').replace(',', ''));
  }
};