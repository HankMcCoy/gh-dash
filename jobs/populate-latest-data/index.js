#! /usr/bin/env node
'use strict'
const MongoClient = require('mongodb').MongoClient
const _ = require('lodash')

const delay = require('./delay')
const getProcessedPrs = require('./get-processed-prs')
const { getGhUrl, getGhJson } = require('./xhr')

// Connection URL
const mongoConnectionStr = 'mongodb://localhost:27017/gh-dash'

// Use connect method to connect to the server
MongoClient.connect(mongoConnectionStr)
  .then(db => {
    console.log('Connected successfully to db')

    return Promise.resolve()
      .then(() => db.collection('pullRequests').deleteMany({}))
      .then(() => console.log('Deleted all previous PRs'))
      .then(() => populatePrs({ db }))
      .then(() => console.log('All PRs added'))
      .then(
        () => db.close(),
        err => {
          db.close()
          throw err
        }
      )
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

const initialUrl = getGhUrl({
  path: 'pulls',
  query: {
    per_page: 10,
    state: 'all',
  },
})
function populatePrs({ db, url = initialUrl }) {
  return getProcessedPrs({ url })
    .then(({ next, prs }) => {
      return db.collection('pullRequests').insertMany(prs).then(results => {
        console.log(`Inserted ${results.result.n} docs`)
        return next
      })
    })
    .then(delay(2000))
    .then(next => (next ? populatePrs({ db, url: next.url }) : null))
}
