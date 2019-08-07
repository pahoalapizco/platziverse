'use strict'

const parsePayload = (payload) => {
  if (payload instanceof Buffer) {
    payload = parsePayload.toString('utf8')
  }

  try {
    payload = JSON.parse(payload)
  } catch (e) {
    payload = {}
  }

  return payload
}

module.exports = {
  parsePayload
}
