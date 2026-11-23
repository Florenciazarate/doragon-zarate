import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcularEstadisticas, calcularProgreso } from '../src/recursos/js/utilidades/estadisticas.js'

const cartas = [
    { id: 'goku', coleccion: 'saiyan', rareza: 5 },
    { id: 'vegeta', coleccion: 'saiyan', rareza: 4 },
    { id: 'piccolo', coleccion: 'namek', rareza: 3 }
]
const colecciones = [
    { id: 'saiyan', nombre: 'Saiyan', total: 120 },
    { id: 'namek', nombre: 'Namek', total: 90 }
]

test('cuenta el total, las 5★ y las duplicadas', () => {
    const inventario = [
        { id: 'goku', cantidad: 2 },
        { id: 'vegeta', cantidad: 1 },
        { id: 'piccolo', cantidad: 3 }
    ]

    // total 2 + 1 + 3 = 6 · 5★: las 2 de goku · duplicadas: 1 + 0 + 2 = 3
    assert.deepEqual(calcularEstadisticas(inventario, cartas), { total: 6, cincoEstrellas: 2, duplicadas: 3 })
})

test('un inventario vacio da todo en cero', () => {
    assert.deepEqual(calcularEstadisticas([], cartas), { total: 0, cincoEstrellas: 0, duplicadas: 0 })
})

test('el progreso cuenta cartas distintas por coleccion', () => {
    const inventario = [
        { id: 'goku', cantidad: 2 },
        { id: 'vegeta', cantidad: 1 }
    ]

    assert.deepEqual(calcularProgreso(inventario, cartas, colecciones), [
        { nombre: 'Saiyan', tengo: 2, total: 120 },
        { nombre: 'Namek', tengo: 0, total: 90 }
    ])
})
