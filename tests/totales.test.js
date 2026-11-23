import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcularTotales } from '../src/recursos/js/utilidades/totales.js'

const productos = [
    { id: 'sobre-a', precio: 4900 },
    { id: 'carta-b', precio: 7500 }
]
const promociones = { descuentoDrop: 900, codigosDescuento: { DORAGON10: 0.1 } }

test('suma los productos y resta el descuento drop', () => {
    const items = [
        { id: 'sobre-a', cantidad: 2 },
        { id: 'carta-b', cantidad: 1 }
    ]
    const resultado = calcularTotales(items, productos, promociones, '')

    assert.deepEqual(resultado, { subtotal: 17300, drop: 900, codigo: 0, total: 16400 })
})

test('aplica el código de descuento sobre el subtotal', () => {
    const items = [
        { id: 'sobre-a', cantidad: 2 },
        { id: 'carta-b', cantidad: 1 }
    ]
    const resultado = calcularTotales(items, productos, promociones, 'DORAGON10')

    assert.equal(resultado.codigo, 1730)
    assert.equal(resultado.total, 14670)
})

test('un carrito vacío da todo en cero (sin descuento drop)', () => {
    const resultado = calcularTotales([], productos, promociones, 'DORAGON10')

    assert.deepEqual(resultado, { subtotal: 0, drop: 0, codigo: 0, total: 0 })
})
