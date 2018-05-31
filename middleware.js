const _ = require('lodash')
// const Buffer = require('Buffer')
const log = require('./log')
const config = require('./config')

/**
 * 返回码
 * @type {Object}
 */
const codes = exports.codes = {
  0: 'Success',

  // 400 Bad Request
  4000000: 'Bad request',
  4000001: 'Missing header',
  4000002: 'Unsupported header',
  4000003: 'Invalid header value',
  4000101: 'Missing parameter',
  4000102: 'Unsupported parameter',
  4000103: 'Invalid parameter value',
  4000111: 'Invalid range',
  4000112: 'Metadata too large',

  // 401 Unauthorized
  4010000: 'Unauthorized',
  4010001: 'Invalid password',
  4010002: 'Invalid accessKey',
  4010003: 'Invalid secretKey',
  4010004: 'Invalid accessKey/secretKey pair',
  4010005: 'Invalid token',
  4010006: 'Invalid sign',
  4010007: 'Sign out of date',


  // 403 Forbidden
  4030000: 'Forbidden',
  4030001: 'Account disabled',

  // 404 Not Found
  4040000: 'Not found',
  4040101: 'appId not found',
  4040102: 'url not found',

  // 405 Method Not Allowed
  4050001: 'Method not allowed',
  4050002: 'Http method not allowed',
  4050003: 'Content-Type not support',

  // 408 Request Timeout
  4080000: 'Request timeout',

  // 409 Conflict
  4090000: 'Conflict',
  4090001: 'Duplicate id',

  // 415 Unsupported Media Type
  4150000: 'Unsupported media type',
  4150001: 'Unsupported image type',

  // 429 Too Many Requests
  4290000: 'Too many request',

  // 500 Internal Server Error
  5000000: 'Internal server error',
  5000101: 'File error',
  5000201: 'Internet error',
  5000301: 'Database error',

  // 503 Service Unavailable
  5030000: 'Service unavailable',
  5030001: 'Server busy'
}



/**
 * 用于统计返回api格式
 * @param  {request}    req   request对象
 * @param  {response}   res   response对象
 * @param  {Function}   next  回调函数
 * @return {null}             无返回
 */
/* eslint no-param-reassign:0 */
exports.handleResponse = (req, res, next) => {
  res.api = (obj = {}, status = 200) => {
    var resObj = {
      code: obj.code || 0
    }
    try {
      res.status(status)
      resObj.msg = obj.msg || codes[resObj.code] || ''
      if (obj.data) {
        resObj.data = obj.data
      }
      res.json(resObj)
    } catch (e) {
      console.log(e)
    }
  }
  next && next()
}

/**
 * 要求登录
 * @param  {request}    req   request对象
 * @param  {response}   res   response对象
 * @param  {Function}   next  回调函数
 * @return {null}             无返回
 */
/* eslint no-param-reassign:0 */
exports.requireAuth = (req, res, next) => {
  function authFail (res) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Login Required"');
    res.status(401).send('Could not verify your access level for that URL.\nYou have to login with proper credentials');
  }
  var auth = req.headers.authorization
  if (auth) {
    auth = auth.toString().split(' ')
    if (auth.length === 2) {
      auth = auth[1]
      try {
        auth = new Buffer(auth, 'base64').toString()
      } catch (err) {
        return authFail(res)
      }
      auth = auth.split(':')
      if (auth.length === 2) {
        if (auth[0] === config.username && auth[1] === config.password) {
          return next()
        }
      }
    }
  }
  authFail(res)
}