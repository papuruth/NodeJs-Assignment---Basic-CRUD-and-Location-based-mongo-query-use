// Get the packages we need
const express = require('express')
const mongoose = require('mongoose')
// const path  = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const route = require('./routes/routes')
const { getSecret } = require('./secrets')

// Connection with MongoDB
mongoose.connect(getSecret('dbUri'), { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to mongoDB')
  })
  .catch((err) => {
    console.log('Error connecting to mongoDB', err)
  })
mongoose.set()

// Create Express application
const app = express()
app.use(cors())

const NODE_ENV = 'development'
// Set constiables
app.set('env', process.env.NODE_ENV || 'production')

// Use environment defined port or 3000
const port = process.env.PORT || 3000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Use static files
// app.use('/static', express.static(path.join(__dirname, 'files')))

app.use('/', route)

// Start the server
app.listen(port)
console.log('Server starts on port ' + port)
console.log('Server starts in  ' + NODE_ENV + ' mode')
