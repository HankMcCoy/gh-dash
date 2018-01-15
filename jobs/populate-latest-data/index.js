#! /usr/bin/env node
'use strict'
const MongoClient = require('mongodb').MongoClient
const _ = require('lodash')
const program = require('commander')
const parseLinkHeader = require('parse-link-header')

const delay = require('./delay')
const {
  getProcessedPrsByUrl,
  getProcessedPrsByNumbers,
} = require('./get-processed-prs')

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
let db

async function updatePrs(prs) {
  const { deletedCount } = await db.collection('pullRequests').deleteMany({
    org: program.org,
    repo: program.repo,
    number: {
      $in: prs.map(pr => pr.number),
    },
  })
  console.log(`Deleted ${deletedCount} PRS`)
  const results = await db.collection('pullRequests').insertMany(prs)
  console.log(`Inserted ${results.result.n} docs`)
}

const xhr = require('./xhr').create({ org: program.org, repo: program.repo })

// Get a list of all PRs newer than what we have in the DB
async function getPrNumbersWeDontHaveYet() {
  let url = getGhUrl({
    path: 'pulls',
    query: {
      per_page: 100,
      state: 'all',
      sort: 'created',
      direction: 'desc',
    },
  })

  let openPrNumbers = []
  const [mostRecentPrWeHave] = await db.collection('pullRequests')
    .find({
      org: program.org,
      repo: program.repo,
    })
    .sort({ number: -1 })
    .limit(1)
    .toArray()

  while (url) {
    const response = await xhr.getJson(url)
    const { headers, body: prs } = response
console.log('Got response', response)
    // Add all PR numbers newer than what we have
    const newPrNumbers = prs
      .map(pr => +pr.number)
      .filter(
        n => mostRecentPrWeHave
          ? n > mostRecentPrWeHave.number
          : true
      )
    openPrNumbers = openPrNumbers.concat(newPrNumbers)
    // If all PR numbers are newer than what we already have, go fetch another page.
    const parsedLinkHeader = headers.link && parseLinkHeader(headers.link)
    url = newPrNumbers.length === prs.length
      ? _.get(parsedLinkHeader, 'next.url')
      : null
  }

  return openPrNumbers
}

// Get a list of all the PRs we _think_ are open
async function getPrsNumbersWeThinkAreOpen() {
  const prsWeThinkAreOpen = await db.collection('pullRequests')
    .find({
      org: program.org,
      repo: program.repo,
      dateClosed: null,
    })
    .toArray()
  console.log('Got PRs we think are open')

  return prsWeThinkAreOpen.map(pr => pr.number)
}

async function populate() {
  // Use connect method to connect to the server
  db = await MongoClient.connect(mongoConnectionStr)
  console.log('Connected successfully to db')

  // Create a list that is the intersection of the PRs we don't already have yet
  // and the PRs we think are open locally.
  const prNumbersToUpdate = _.uniq(_.flatten(await Promise.all([
    getPrNumbersWeDontHaveYet(),
    getPrsNumbersWeThinkAreOpen(),
  ])))

  // Go populate each PR
  const chunkedNumbers = _.chunk(prNumbersToUpdate, 10)
  for (let i = 0; i < prNumbersToUpdate.length; i++) {
    const prNum = prNumbersToUpdate[i]
    const [processedPr] = await getProcessedPrsByNumbers({
      numbers: [prNum],
      xhr,
      org: program.org,
      repo: program.repo,
    })
    await updatePrs([processedPr])
    await delay(2000)
  }

  db.close()
}

populate()
  .then(() => console.log('Done!'))
  .catch((err) => {
    db && db.close()
    console.error(err)
    process.exit(1)
  })
