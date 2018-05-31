const ObjectId = require('mongodb').ObjectID
const shortid = require('shortid')
const validURL = require('valid-url')
const log = require('./log')
const config = require('./config')

/**
 * GET 取得短连接
 * @param {Object}    req request
 * @param {Object}    res response
 * @return {Promise}  Promise
 */
exports.getShortLink = async (req, res) => {
  var Users = db.collection('users')
  var Links = db.collection('links')
  var query = req.query || {}
  var user, link, encodedId
  // 较验参数
  if (!query.appId) {
    return res.api({ code: 4000101, msg: 'Missing parameter [appId].' }, 400)
  }
  if (!query.url) {
    return res.api({ code: 4000101, msg: 'Missing parameter [url].' }, 400)
  }
  if (!validURL.isUri(query.url)) {
    return res.api({ code: 4000103, msg: 'Invalid parameter value [url].' }, 400)
  }
  // 较验 appId
  try {
    user = await Users.findOne({ _id: query.appId })
  } catch (err) {
    log.error(err)
    return res.api({ code: 5000301, msg: 'Database error [select appId].' }, 500)
  }
  if (!user) {
    return res.api({ code: 4040101 }, 404)
  }
  // 查找该url是否已经存在
  try {
    link = await Links.findOne({ url: query.url })
  } catch (err) {
    log.error(err)
    return res.api({ code: 5000301, msg: 'Database error [select url].' }, 500)
  }
  if (!link) {
    // 生成短链接
    encodedId = shortid.generate().replace(/\-/g, 'LI').replace(/_/g, 'UN')
    try {
      link = await Links.insert({ _id: encodedId, url: query.url, appId: query.appId })
    } catch (err) {
      log.error(err)
      return res.api({ code: 5000301, msg: 'Database error [insert encodeId].' }, 500)
    }
    link = link.ops[0]
  }
  // 返回完整的url
  res.api({
    code: 0,
    data: {
      url: `${config.domain}/${link._id}`
    }
  }, 200)
}


/**
 * GET 取得长连接
 * @param {Object}    req request
 * @param {Object}    res response
 * @return {Promise}  Promise
 */
exports.redirectLink = async (req, res) => {
  var Links = db.collection('links')
  var encodedId = req.params.encodedId
  try {
    link = await Links.findOne({ _id: encodedId})
  } catch (err) {
    log.error(err)
    return res.api({ code: 5000301, msg: 'Database error [select encodeId].' }, 500)
  }
  if (!link) {
    return res.api({ code: 4040102 }, 404)
  }
  res.redirect(301, link.url)
}