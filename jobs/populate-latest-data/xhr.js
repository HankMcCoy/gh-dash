'use strict'

const parseLinkHeader = require('parse-link-header')
const request = require('superagent-promise')(require('superagent'), Promise)
const querystring = require('querystring')

const token = process.env.GH_TOKEN
const api = 'https://api.github.com'

const retryInRoughly = (seconds, fn) => {
  const randomExtraTime = Math.round(Math.random() * 2000) + 500
  setTimeout(fn, seconds * 1000 + randomExtraTime)
}

exports.create = ({ org, repo }) => {
  const repoUrl = `${api}/repos/${org}/${repo}`
  const getJson = url =>
    request
      .get(url)
      .set('Accept', 'application/vnd.github.mockingbird-preview')
      .end()
      .then(
        res => ({
          headers: res.header,
          body: res.body,
        }),
        err => {
          // 404s show up sometimes, due to some OS thing w/ DNS. Just retry.
          if (err.code == 'ENOTFOUND') {
            console.log('Hit file limit thingy, waiting a second…')
            return new Promise(resolve => {
              retryInRoughly(1, () => resolve(getJson(url)))
            })
          }

          if (!err.response) {
            throw err
          }

          if (err.response.statusCode == '401') {
            throw new Error('Uh oh, looks like you forgot the access token!')
          }

          const retryAfter = +err.response.header['retry-after']
          const remaining = err.response.header['x-ratelimit-remaining']
          const reset = +err.response.header['x-ratelimit-reset']
          const resetDate = new Date(reset * 1000)
          const secDiff = Math.ceil((resetDate - new Date()) / 1000)

          if (retryAfter) {
            return new Promise(resolve => {
              console.log(`Hit abuse detection, waiting ${retryAfter} seconds`)
              retryInRoughly(retryAfter, () => resolve(getJson(url)))
            })
          }

          if (remaining) {
            return new Promise(resolve => {
              console.log(`Rate limit hit, waiting ${secDiff} seconds`)
              retryInRoughly(secDiff, () => resolve(getJson(url)))
            })
          }
          return Promise.reject(err)
        }
      )

  const getGhUrl = ({ path, query }) => {
    let queryStr = querystring.stringify(query)
    queryStr = queryStr
      ? `${queryStr}&access_token=${token}`
      : `access_token=${token}`

    return path.startsWith('/')
      ? `${api}${path}?${queryStr}`
      : `${repoUrl}/${path}?${queryStr}`
  }

  const getGhJson = ({ path, query }) => {
    const url = getGhUrl({ path, query })

    return getJson(url)
  }

  return {
    getJson,
    getGhUrl,
    getGhJson,
  }
}
