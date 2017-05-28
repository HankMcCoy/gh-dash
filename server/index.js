const express = require('express')
const path = require('path')
const app = express()
const MongoClient = require('mongodb').MongoClient

const mongoConnectionStr = 'mongodb://localhost:27017/gh-dash'

let db

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

app.use('/js', express.static(path.join(__dirname, '../client/js')))

app.get('/api/pull-requests', (req, res) => {
  db.collection('pullRequests').find().toArray((err, prs) => {
    res.send({ pullRequests: prs })
  })
})

MongoClient.connect(mongoConnectionStr).then(dbConnection => {
  console.log('Connected to Mongo')
  db = dbConnection
  app.listen(3000, () => {
    console.log('Server started')
  })
})
