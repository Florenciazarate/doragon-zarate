import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sortearRareza } from '../src/recursos/js/utilidades/sorteo.js'

// Math.random da un numero distinto cada vez y el test necesita un resultado fijo
// -> lo reemplazamos por una funcion que devuelve siempre lo mismo (mock)
const tabla = [
    { rareza: 5, porcentaje: 4 },
    { rareza: 4, porcentaje: 16 },
    { rareza: 3, porcentaje: 35 },
    { rareza: 2, porcentaje: 45 }
]

test('un número bajo cae en la primera rareza (5★)', (t) => {
    t.mock.method(Math, 'random', () => 0.01) //<- 1, entra en el primer 4%
    assert.equal(sortearRareza(tabla), 5)
})

test('un número intermedio cae en la rareza que le corresponde', (t) => {
    t.mock.method(Math, 'random', () => 0.3) //<- 30, supera 4 + 16 = 20 -> 3★
    assert.equal(sortearRareza(tabla), 3)
})

test('un número alto cae en la última rareza (2★)', (t) => {
    t.mock.method(Math, 'random', () => 0.99) //<- 99, supera 4 + 16 + 35 = 55 -> 2★
    assert.equal(sortearRareza(tabla), 2)
})

test('siempre devuelve una rareza que existe en la tabla', () => {
    const rarezas = tabla.map((opcion) => opcion.rareza)

    for (let i = 0; i < 1000; i++) {
        assert.ok(rarezas.includes(sortearRareza(tabla)))
    }
})
