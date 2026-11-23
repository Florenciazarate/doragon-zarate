import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatoPrecio, numeroCarta } from '../src/recursos/js/utilidades/formato.js'

test('formatoPrecio agrega el signo $ y el punto de miles', () => {
    assert.equal(formatoPrecio(4900), '$4.900')
    assert.equal(formatoPrecio(15800), '$15.800')
})

test('formatoPrecio con valores chicos no agrega punto', () => {
    assert.equal(formatoPrecio(0), '$0')
    assert.equal(formatoPrecio(900), '$900')
})

test('numeroCarta completa con ceros a la izquierda', () => {
    assert.equal(numeroCarta(7, 90), '007/90')
    assert.equal(numeroCarta(114, 120), '114/120')
})
