import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearMensajePedido, crearEnlaceWhatsapp } from '../src/recursos/js/utilidades/pedido.js'

const pedido = {
    numero: 'DR-12345',
    metodo: 'Transferencia',
    items: [{ nombre: 'Sobre Saiyan Élite', cantidad: 2, importe: 9800 }],
    totales: { total: 8900 },
    cliente: {
        nombre: 'Ana Pérez',
        telefono: '1123456789',
        email: 'ana@correo.com',
        direccion: 'Calle 123',
        ciudad: 'CABA'
    }
}

test('el mensaje incluye número de pedido, productos y total', () => {
    const mensaje = crearMensajePedido(pedido)

    assert.match(mensaje, /DR-12345/)
    assert.match(mensaje, /Sobre Saiyan Élite x2/)
    assert.match(mensaje, /Total: \$8\.900/)
})

test('el enlace apunta a wa.me con el mensaje codificado', () => {
    const enlace = crearEnlaceWhatsapp('5491100000000', 'Hola mundo')

    assert.equal(enlace, 'https://wa.me/5491100000000?text=Hola%20mundo')
})
