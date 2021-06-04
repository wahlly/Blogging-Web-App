const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.port || 8000
const bodyParser = require('./middlewares/middleware')
const connectDB = require('./models/dbconfig')
const route = require('./routes/index')

connectDB()

app.use(cors())
bodyParser(app)
route(app)


app.listen(port, () => console.log(`server is running on ${port}`))