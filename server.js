const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.port || 8000
const bodyParser = require('./middlewares/middleware')
const connectDB = require('./models/dbconfig')
const route = require('./routes/index')
const passport = require('passport')
const session = require('express-session')


app.use(passport.initialize())
app.use(passport.session())
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}))

connectDB()

app.use(cors())

bodyParser(app)
route(app)


app.listen(port, () => console.log(`server is running on ${port}`))