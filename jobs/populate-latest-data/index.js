#! /usr/bin/env node
'use strict'
const MongoClient = require('mongodb').MongoClient
const _ = require('lodash')

const getProcessedPrs = require('./get-processed-prs')
const { getGhJson } = require('./xhr')

// Connection URL
const mongoConnectionStr = 'mongodb://localhost:27017/gh-dash'

const getProcessedPrsPromise = getProcessedPrs({
  page: 1,
  perPage: 50,
})

// Use connect method to connect to the server
MongoClient.connect(mongoConnectionStr)
  .then(db => {
    console.log('Connected successfully to db')

    Promise.all([
      getProcessedPrsPromise,
      db.collection('pullRequests').deleteMany({}),
      getGhJson({ path: '/rate_limit' }).then(rateLimit => {
        console.log(rateLimit)
      }),
    ])
      .then(([finalPrs]) => {
        return db.collection('pullRequests').insertMany(finalPrs)
      })
      .then(results => {
        console.log(`Inserted ${results.result.n} docs into the collection`)
        return results
      })
      .catch(err => {
        console.error(err)
      })
      .then(() => db.close())
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
