'use strict'

const jwt = require('jsonwebtoken')

function sing (payload, secret, callback) {
    jwt.sign(payload, secret, callback)
}

function verify (tocken, secret, callback) {
    jwt.verify(tocken, secret, callback)
}

module.exports = {
    sing,
    verify
}
