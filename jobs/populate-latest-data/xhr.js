'use strict'

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
    .then(res => res.body)

exports.getGhJson = ({ path, query }) => {
  let queryStr = querystring.stringify(query)
  queryStr = queryStr
    ? `${queryStr}&access_token=${token}`
    : `access_token=${token}`

  return path.startsWith('/')
    ? getJson(`${api}${path}?${queryStr}`)
    : getJson(`${repoUrl}/${path}?${queryStr}`)
}
