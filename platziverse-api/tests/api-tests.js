'use strict'

const test = require('ava')
const request = require('supertest')
const server = require('../server')

// serial: corre lista de test encapsuladas en un segmento
// cb: ejecuta un callback al final, esto debido a la utilización de supertest.
test.serial.cb('/api/agents', t => {
  request(server)
    .get('/api/agents')
    .expect(200)
    .expect('Content-Type',/json/)
    .end((err, res) => {
      t.falsy(err, 'No deberia regresar un error.')
      let body = res.body
      t.deepEqual(body, {}, 'El body de a respuesta debe ser igual al esperado (obj vacio)')
      t.end() // esta función solo se utiliza cuando usamos la funcion .cb()
    })
})
