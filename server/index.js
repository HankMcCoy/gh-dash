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
  db
    .collection('pullRequests')
    .find({ dateClosed: null })
    .toArray((err, prs) => {
      res.send({ pullRequests: prs })
    })
})

app.get('/api/review-times', (req, res) => {
  const weekInMs = 1000 * 60 * 60 * 24 * 7
  const startDate = new Date(Date.now() - 10 * weekInMs)

  db
    .collection('pullRequests')
    .aggregate([
      {
        $match: {
          dateMerged: { $gt: startDate },
        },
      },
      {
        $group: {
          _id: { $week: '$dateMerged' },
          spentInReview: {
            $avg: '$times.spentInReview',
          },
          waitingForReview: {
            $avg: '$times.waitingForReview',
          },
          afterReviewBeforeMerge: {
            $avg: '$times.afterReviewBeforeMerge',
          },
        },
      },
    ])
    .toArray((err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.send({ reviewTimes: results })
      }
    })
})

app.get('/api/revisions-by-author/:author', (req, res) => {
  const { author } = req.params

  db
    .collection('pullRequests')
    .aggregate([
      {
        $match: {
          author,
          gtgReviewer: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$gtgReviewer',
          numRevisions: { $sum: '$numRevisions' },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray((err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.send({ revisionCounts: results.sort(compareByAttr('_id')) })
      }
    })
})

app.get('/api/revisions-by-reviewer/:reviewer', (req, res) => {
  const { reviewer } = req.params

  db
    .collection('pullRequests')
    .aggregate([
      {
        $match: {
          gtgReviewer: reviewer,
        },
      },
      {
        $group: {
          _id: '$author',
          numRevisions: { $sum: '$numRevisions' },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray((err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.send({ revisionCounts: results.sort(compareByAttr('_id')) })
      }
    })
})

const compareByAttr = attr => (a, b) => caseInsensitiveCompare(a[attr], b[attr])
const caseInsensitiveCompare = (a, b) => {
  if (a.toLowerCase() < b.toLowerCase()) {
    return -1
  } else if (a.toLowerCase() > b.toLowerCase()) {
    return 1
  }
  return 0
}

app.get('/api/reviewers', (req, res) => {
  db.collection('pullRequests').distinct('gtgReviewer').then(reviewers => {
    res.send({
      reviewers: reviewers.filter(x => x).sort(caseInsensitiveCompare),
    })
  })
})

app.get('/api/authors', (req, res) => {
  db.collection('pullRequests').distinct('author').then(authors => {
    res.send({ authors: authors.filter(x => x).sort(caseInsensitiveCompare) })
  })
})

MongoClient.connect(mongoConnectionStr).then(
  dbConnection => {
    console.log('Connected to Mongo')
    db = dbConnection
    app.listen(3000, () => {
      console.log('Server started')
    })
  },
  err => {
    console.error(err)
  }
)
