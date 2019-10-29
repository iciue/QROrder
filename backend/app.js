const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const http = require('http')
const {restaurant, desk} = require('./io-server')

const userAccountMiddleware = require('./mw/user-account')
const restaurantMiddleware = require('./mw/restaurant')

const port = 8888

const app = express()
const server = http.createServer()
server.on('request', app)

restaurant.attach(server)
desk.attach(server)

;(async() => {
  const db = await require('./db/db-conn')
  global.db = db
  server.listen(port, () => console.log(`app listening on ${port}`))
})();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next()
})

app.use(cors({
  origin: true,
  maxAge: 86400,
  credentials: true,
}))

app.use(cookieParser('my-secret'))

app.use(express.static(__dirname + '/static'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use('/api', userAccountMiddleware)
app.use('/api', restaurantMiddleware)
