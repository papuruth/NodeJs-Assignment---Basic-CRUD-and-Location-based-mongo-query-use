// Get the packages we need
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var cors = require('cors')
var route = require('./routes/routes')

// Connection with MongoDB
mongoose.connect('mongodb://localhost:27017/JobPortal', { useNewUrlParser: true })
const connection = mongoose.connection
connection.once('open', () => {
  console.log('Connection to MongoDB Successful')
})

connection.on('error', () => {
    console.log('Connection to MongoDB Unsuccessful')
})

// Create Express application
var app = express()
app.use(cors())

var NODE_ENV = 'development'
// Set Variables
app.set('env', process.env.NODE_ENV || 'production')

// Use environment defined port or 3000
var port = process.env.PORT || 3000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', route)

// Start the server
app.listen(port)
console.log('Server starts on port ' + port)
console.log('Server starts in  ' + NODE_ENV + ' mode')
