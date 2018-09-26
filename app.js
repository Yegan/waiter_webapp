const express = require('express')
const app = express()
const flash = require('express-flash')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const waiterFunc = require('./waiterFunc.js')
const waiterRoutes = require('./routes/routes.js')
const postgres = require('pg')
const Pool = postgres.Pool

const connectionString = process.env.DATABASE_URL || 'postgres://coder:pg123@localhost:5432/waiter-db'

const pool = new Pool({
  connectionString
})

const funcWaiter = waiterFunc(pool)
const routesWaiter = waiterRoutes(funcWaiter)

// Handlebar engine allowing for templating of data

app.engine('handlebars', exphbs({
  defaultLayout: 'main'

}))

app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: false
}))
// initialise session middleware - flash-express depends on it
app.use(session({
  secret: '<add a secret string here>',
  resave: false,
  saveUninitialized: true
}))

app.get('/', routesWaiter.home)

// initialise the flash middleware
app.use(flash())
app.use(bodyParser.json())

let PORT = process.env.PORT || 3020

app.listen(PORT, function () {
  console.log('App starting on port', PORT)
})