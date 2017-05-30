'use strict'

const parseLinkHeader = require('parse-link-header')
const request = require('superagent-promise')(require('superagent'), Promise)
const querystring = require('querystring')

const org = 'buildingconnected'
const repo = 'client'
const token = process.env.GH_TOKEN
const api = 'https://api.github.com'
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
        if (!err.response) {
          throw err
        }

        const retryAfter = +err.response.header['retry-after']
        const remaining = err.response.header['x-ratelimit-remaining']
        const reset = +err.response.header['x-ratelimit-reset']
        const resetDate = new Date(reset * 1000)
        const msDiff = resetDate - new Date()

        if (retryAfter) {
          return new Promise(resolve => {
            console.log(`Hit abuse detection, waiting ${retryAfter} seconds`)
            setTimeout(() => resolve(getJson(url)), retryAfter * 1000)
          })
        }
        if (remaining) {
          return new Promise(resolve => {
            console.log(
              `Rate limit hit, waiting ${Math.round(msDiff / 1000)} seconds`
            )
            setTimeout(() => resolve(getJson(url)), msDiff)
          })
        }
        return Promise.reject(err)
      }
    )
exports.getJson = getJson

const getGhUrl = ({ path, query }) => {
  let queryStr = querystring.stringify(query)
  queryStr = queryStr
    ? `${queryStr}&access_token=${token}`
    : `access_token=${token}`

  return path.startsWith('/')
    ? `${api}${path}?${queryStr}`
    : `${repoUrl}/${path}?${queryStr}`
}
exports.getGhUrl = getGhUrl

exports.getGhJson = ({ path, query }) => {
  const url = getGhUrl({ path, query })

  return getJson(url)
}
