const _ = require('lodash')

var config = {
  domain: '',
  mongoUrl: '',
  port: 12345,

  username: '',
  password: ''
}

try {
  /* eslint vars-on-top:0 */
  var ex = require('./configEx.js');
  if (ex) {
    _.assign(config, ex);
  }
} catch (e) {
  // 无需处理
}

module.exports = config