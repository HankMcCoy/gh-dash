#! /usr/bin/env node
'use strict'
const MongoClient = require('mongodb').MongoClient
const _ = require('lodash')
const program = require('commander')

const delay = require('./delay')
const getProcessedPrs = require('./get-processed-prs')

program
  .option('-o, --org <value>', 'The GH organization to query')
  .option('-r, --repo <value>', 'The GH repo to query')
  .parse(process.argv)

const { getGhUrl, getGhJson } = require('./xhr').create({
  org: program.org,
  repo: program.repo,
})

// Connection URL
const mongoConnectionStr = 'mongodb://localhost:27017/gh-dash'

// Use connect method to connect to the server
MongoClient.connect(mongoConnectionStr)
  .then(db => {
    console.log('Connected successfully to db')

    return Promise.resolve()
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
  return getProcessedPrs({
    url,
    org: program.org,
    repo: program.repo,
  })
    .then(({ next, prs }) => {
      return Promise.resolve()
        .then(() =>
          db
            .collection('pullRequests')
            .deleteMany({ number: { $in: prs.map(pr => pr.number) } })
        )
        .then(({ deletedCount }) => console.log(`Deleted ${deletedCount} PRS`))
        .then(() => db.collection('pullRequests').insertMany(prs))
        .then(results => {
          console.log(`Inserted ${results.result.n} docs`)
          return next
        })
    })
    .then(delay(2000))
    .then(next => (next ? populatePrs({ db, url: next.url }) : null))
}
