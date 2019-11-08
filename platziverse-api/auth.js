'use strict'

const jwt = require('jsonwebtoken')

function sign (payload, secret, callback) {
    jwt.sign(payload, secret, callback)
}

function verify (tocken, secret, callback) {
    jwt.verify(tocken, secret, callback)
}

module.exports = {
    sign,
    verify
}
