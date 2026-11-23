import { URL_PRODUCTOS } from '../config.js'
import obtenerDatos from '../datos.js'
import { formatoPrecio } from '../utilidades/formato.js'
import { leerCarrito, contarUnidades } from '../utilidades/carrito.js'

// Panel lateral con el resumen del carrito (se abre al agregar o desde el icono)
// Usamos un <dialog> con showModal(), como vimos en clase con el dialogo

let productos = []

const panel = document.createElement('dialog')
panel.className = 'panel-carrito'
panel.setAttribute('aria-labelledby', 'panel-carrito-titulo')
document.body.append(panel)

function buscarProducto(id) {
    return productos.find((producto) => {
        return producto.id === id
    })
}

function crearLista(productosEnCarro) {
    if (productosEnCarro.length === 0) {
        return `<p class="vacio">Tu carrito está vacío.</p>`
    }

    let listaHTML = ''
    let subtotal = 0

    productosEnCarro.forEach((item) => {
        const producto = buscarProducto(item.id)
        const importe = producto.precio * item.cantidad
        subtotal += importe

        listaHTML += `
        <li>
            <img src="${producto.imagen}" alt="" width="48" height="66">
            <div>
                <p class="nombre">${producto.nombre}</p>
                <p class="detalle">Cantidad: ${item.cantidad}</p>
            </div>
            <p class="precio">${formatoPrecio(importe)}</p>
        </li>
        `
    })

    return `
    <ul class="lista">${listaHTML}</ul>
    <p class="subtotal"><span>Subtotal</span> <strong>${formatoPrecio(subtotal)}</strong></p>
    `
}

function renderizarPanel(agregado) {
    const productosEnCarro = leerCarrito()

    // Si se abre despues de agregar, mostramos que producto se sumo (o si no habia mas stock)
    let aviso = ''

    if (agregado && agregado.sinStock) {
        aviso = `<p class="agregado sin-stock" role="status">Ya tenés en el carrito todo el stock disponible de ${agregado.nombre}.</p>`
    } else if (agregado) {
        aviso = `<p class="agregado" role="status">✓ Agregaste ${agregado.nombre} al carrito.</p>`
    }

    panel.innerHTML = `
    <div class="encabezado">
        <h2 id="panel-carrito-titulo">Tu carrito (${contarUnidades(productosEnCarro)})</h2>
        <button class="cerrar" type="button" data-cerrar aria-label="Cerrar carrito">×</button>
    </div>
    ${aviso}
    ${crearLista(productosEnCarro)}
    <div class="acciones">
        <button class="boton secundario" type="button" data-cerrar>Seguir comprando</button>
        <a class="boton primario" href="./carrito.html">Ir al carrito</a>
    </div>
    `
}

// agregado: el producto que se acaba de sumar (o null si se abre desde el icono)
async function abrirPanel(agregado) {
    try {
        if (productos.length === 0) {
            productos = await obtenerDatos(URL_PRODUCTOS) //<- se pide una sola vez
        }

        renderizarPanel(agregado)
        panel.showModal()
    } catch (error) {
        console.error(error)
        window.location.href = './carrito.html' //<- si falla, vamos a la pagina del carrito
    }
}

// Eventos
panel.addEventListener('click', (evento) => {
    // Cerramos con los botones o haciendo clic afuera del panel (en el fondo)
    if (evento.target.closest('[data-cerrar]') || evento.target === panel) {
        panel.close()
    }
})

export { abrirPanel }
