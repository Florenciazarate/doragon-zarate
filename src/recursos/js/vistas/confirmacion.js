import { formatoPrecio } from '../utilidades/formato.js'
import { leerPedido } from '../utilidades/carrito.js'

// Referenciamos elementos del html
const titulo = document.getElementById('confirmacion-titulo')
const texto = document.getElementById('confirmacion-texto')
const resumen = document.getElementById('confirmacion-resumen')
const notificacion = document.getElementById('notificacion')
const botonWhatsapp = document.getElementById('enviar-whatsapp')
const botonSobres = document.getElementById('abrir-sobres')

const pedido = leerPedido()

if (pedido === null) {
    // No hay pedido guardado
    titulo.textContent = 'No hay un pedido reciente'
    texto.innerHTML = `Cuando confirmes una compra vas a ver acá el resumen. <a href="./catalogo.html">Ir al catálogo</a>.`
    resumen.hidden = true
    botonWhatsapp.hidden = true
} else {
    // Completamos con los datos del pedido
    document.getElementById('pedido-numero').textContent = pedido.numero
    document.getElementById('pedido-total').textContent = formatoPrecio(pedido.totales.total)
    document.getElementById('pedido-entrega').textContent = pedido.entrega
    botonWhatsapp.href = pedido.enlaceWhatsapp
    botonSobres.hidden = !pedido.conSobres //<- solo si compro sobres

    // Notificacion
    notificacion.textContent = `¡Gracias, ${pedido.cliente.nombre}! Registramos el pedido ${pedido.numero}. Si WhatsApp no se abrió, usá el botón "Enviar por WhatsApp".`
    notificacion.hidden = false
}
