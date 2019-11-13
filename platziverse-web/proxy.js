'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const request = require('request-promise-native')
const { endpoint, apiToken } = require('./config')

const api = asyncify(express.Router())

api.get('/agents', async (req, res, next) => {
  const optios = {
    method: 'GET',
    url: `${endpoint}/api/agents`,
    headers: {
      Authorization: `Bearer ${apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(optios)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

api.get('/agents/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  const optios = {
    method: 'GET',
    url: `${endpoint}/api/agents/${uuid}`,
    headers: {
      Authorization: `Bearer ${apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(optios)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  const optios = {
    method: 'GET',
    url: `${endpoint}/api/metrics/${uuid}`,
    headers: {
      Authorization: `Bearer ${apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(optios)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params
  
  const optios = {
    method: 'GET',
    url: `${endpoint}/api/metrics/${uuid}/${type}`,
    headers: {
      Authorization: `Bearer ${apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(optios)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

module.exports = api
