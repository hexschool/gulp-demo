const minimist = require('minimist'); // 用來讀取指令轉成變數
const envOptions = {
  string: 'env',
  default: { env: 'development' }
};
const options = minimist(process.argv.slice(2), envOptions);

exports.options = options;