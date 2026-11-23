import { formatoPrecio } from './formato.js'

// Armamos el texto del pedido para WhatsApp
function crearMensajePedido(pedido) {
    const lineas = pedido.items.map((item) => {
        return `• ${item.nombre} x${item.cantidad} — ${formatoPrecio(item.importe)}`
    })

    const mensaje = [
        `Hola Doragon! Quiero confirmar el pedido ${pedido.numero}.`,
        '',
        ...lineas, // (spread)
        '',
        `Total: ${formatoPrecio(pedido.totales.total)}`,
        `Pago: ${pedido.metodo}`,
        '',
        `Nombre: ${pedido.cliente.nombre}`,
        `Teléfono: ${pedido.cliente.telefono}`,
        `Email: ${pedido.cliente.email}`,
        `Envío a: ${pedido.cliente.direccion}, ${pedido.cliente.ciudad}`
    ]

    return mensaje.join('\n')
}

// wa.me abre el chat con el mensaje ya escrito
function crearEnlaceWhatsapp(numero, mensaje) {
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}` //<- encodeURIComponent: espacios y saltos de linea para la URL
}

// Fecha de entrega: hoy + dias (ej: "27 de noviembre")
function calcularEntrega(fecha, dias) {
    const entrega = new Date(fecha)
    entrega.setDate(entrega.getDate() + dias)
    return entrega.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
}

export { crearMensajePedido, crearEnlaceWhatsapp, calcularEntrega }
