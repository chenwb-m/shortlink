const http = require('http')
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const colors = require('colors/safe')
const bodyParser = require('body-parser')
const log = require('./log')
const handleResponse = require('./middleware').handleResponse
const requireAuth = require('./middleware').requireAuth
const ctrl = require('./controller')
const MongoClient = require('mongodb').MongoClient;
// global.ObjectID = require('mongodb').ObjectID;
const config = require('./config')

var app = express()
var db = global.db = null

// CORS middleware
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}

// Connect Mongo
const connectDB = () => new Promise((resolve, reject) => {
  MongoClient.connect(config.mongoUrl, (err, instance) => {
    err ? reject(err) : db = global.db = instance, resolve(instance)
  })
})

// Start Server
const startServer = () => new Promise((resolve, reject) => {
  app.use(morgan('dev'))
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
  app.use(handleResponse)
  // router
  app.get('/', requireAuth, (req, res) => { res.sendFile(path.join(__dirname, './index.html')) })
  app.get('/favicon.ico', (req, res) => { res.statusCode = 404; res.end() })
  app.get('/api/short', ctrl.getShortLink)
  app.get('/:encodedId', ctrl.redirectLink)
  // instance
  const server = http.createServer(app)
  server.listen(config.port, (err) => {
    err ? reject(err) : resolve()
  })
  server.on('error', (err) => {
    // TODO: 这里的错语需要处理
    log.error(err)
  })
})


// Run
var run = async () => {
  var env = process.env.NODE_ENV === 'production' ? 'Production' : 'Develop'
  try {
    log.info(`---------------- ${colors.magenta('Common Short Link')} ----------------`)
    log.info(`-> Server run in ${colors.magenta(env)} model`)
    // 连接数据库
    log.info(`-> Connecting database ${colors.magenta(config.mongoUrl)} ...`)
    await connectDB()
    log.info('-> Connect database success')
    // 启动web服务
    log.info('-> Starting server ...')
    await startServer()
    log.info(`-> Server listen on ${colors.magenta(config.port)}`)
  } catch (err) {
    log.error(err)
  }
}

run()

