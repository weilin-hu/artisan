
const numeral = require('numeral');

const getNum = (num) => {
  if (num > 999) {
    return numeral(num).format('0.0a');
  } else {
    return num;
  }
};

export { getNum };
