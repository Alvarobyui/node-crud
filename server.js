const express = require('express')
const body_parser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = "mongodb+srv://crud:crud@crud.52qnggc.mongodb.net/?retryWrites=true&w=majority"

app.listen(3000, function () {
  console.log('listening on 3000')
})

MongoClient.connect(connectionString)
  .then(client => {
    console.log('Connected to Database')
  })
  .catch(error => console.error(error))

app.use(body_parser.urlencoded({ extended: true}))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
  // Note: __dirname is the current directory you're in. Try logging it and see what you get!
  // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
})

app.post('/quotes', (req, res) => {
  console.log('Hellooooooooooooooooo!')
  console.log(req.body)
})