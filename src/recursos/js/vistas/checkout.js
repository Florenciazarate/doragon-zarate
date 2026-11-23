import { URL_PRODUCTOS, URL_PROMOCIONES, URL_INVENTARIO, WHATSAPP_TIENDA } from '../config.js'
import obtenerDatos, { mostrarError } from '../datos.js'
import { formatoPrecio } from '../utilidades/formato.js'
import { calcularTotales } from '../utilidades/totales.js'
import { leerCarrito, leerCodigo, vaciarCarrito, guardarPedido } from '../utilidades/carrito.js'
import { agregarSobres, leerInventario, agregarAlInventario } from '../utilidades/coleccion.js'
import { validarCampo, validarFormulario } from '../utilidades/validaciones.js'
import { crearMensajePedido, crearEnlaceWhatsapp, calcularEntrega } from '../utilidades/pedido.js'

// Referenciamos elementos del html
const formulario = document.getElementById('pago')
const bloques = formulario.querySelectorAll('[data-metodo]')
const listaPedido = document.getElementById('resumen-pedido')
const totalPedido = document.getElementById('total-pedido')
const botonConfirmar = document.getElementById('confirmar')
const avisoFormulario = document.getElementById('aviso-formulario')

const nombresMetodo = {
    tarjeta: 'Tarjeta',
    billetera: 'Billetera virtual',
    transferencia: 'Transferencia'
}

let productos = []
let productosEnCarro = []
let resumen = null
let inventario = []

// Metodo de pago-------
function mostrarMetodo() {
    const elegido = formulario.querySelector("input[name='metodo-pago']:checked").value

    bloques.forEach((bloque) => {
        const activo = bloque.dataset.metodo === elegido

        bloque.hidden = !activo

        // Deshabilitamos los campos del metodo que no se usa
        bloque.querySelectorAll('input').forEach((campo) => {
            campo.disabled = !activo
        })
    })
}

// Resumen del pedido-------
function buscarProducto(id) {
    return productos.find((producto) => {
        return producto.id === id
    })
}

function renderizarPedido() {
    if (productosEnCarro.length === 0) {
        listaPedido.innerHTML = `<li>Tu carrito está vacío. <a href="./catalogo.html">Mirá el catálogo</a>.</li>`
        totalPedido.textContent = formatoPrecio(0)
        botonConfirmar.disabled = true
        return
    }

    let pedidoHTML = ''

    productosEnCarro.forEach((item) => {
        const producto = buscarProducto(item.id)

        pedidoHTML += `
        <li>
            <span>${producto.nombre} x${item.cantidad}</span>
            <span class="precio">${formatoPrecio(producto.precio * item.cantidad)}</span>
        </li>
        `
    })

    listaPedido.innerHTML = pedidoHTML
    totalPedido.textContent = formatoPrecio(resumen.total)
}

// Confirmar y enviar-------
function crearPedido() {
    const datos = new FormData(formulario)
    const fecha = new Date()

    const items = productosEnCarro.map((item) => {
        const producto = buscarProducto(item.id)
        return {
            nombre: producto.nombre,
            cantidad: item.cantidad,
            importe: producto.precio * item.cantidad
        }
    })

    // Los datos de la tarjeta no se guardan ni se envian
    return {
        numero: 'DR-' + Math.floor(10000 + Math.random() * 90000),
        fecha: fecha.toISOString(),
        entrega: calcularEntrega(fecha, 2),
        metodo: nombresMetodo[datos.get('metodo-pago')],
        cliente: {
            nombre: datos.get('nombre').trim(),
            email: datos.get('email').trim(),
            telefono: datos.get('telefono').trim(),
            direccion: datos.get('direccion').trim(),
            ciudad: datos.get('ciudad').trim() + ' (CP ' + datos.get('postal') + ')'
        },
        items: items,
        totales: resumen
    }
}

function confirmarPedido(evento) {
    evento.preventDefault() //<- evitamos que el formulario recargue la pagina

    if (!validarFormulario(formulario, avisoFormulario)) {
        return
    }

    const pedido = crearPedido()
    pedido.enlaceWhatsapp = crearEnlaceWhatsapp(WHATSAPP_TIENDA, crearMensajePedido(pedido))

    // Los sobres comprados quedan disponibles para abrir
    const sobresComprados = productosEnCarro.filter((item) => {
        return buscarProducto(item.id).tipo === 'sobres'
    })
    agregarSobres(sobresComprados)
    pedido.conSobres = sobresComprados.length > 0

    // Las cartas sueltas y exclusivas se suman al inventario
    const cartasCompradas = productosEnCarro
        .filter((item) => {
            return buscarProducto(item.id).tipo !== 'sobres'
        })
        .map((item) => {
            return { id: buscarProducto(item.id).carta, cantidad: item.cantidad }
        })
    agregarAlInventario(inventario, cartasCompradas)

    guardarPedido(pedido)
    vaciarCarrito()

    // Abrimos WhatsApp en otra pestaña y vamos a la confirmacion
    window.open(pedido.enlaceWhatsapp, '_blank')
    window.location.href = './confirmacion.html'
}

// Eventos
formulario.addEventListener('change', (evento) => {
    if (evento.target.name === 'metodo-pago') {
        mostrarMetodo()
    }
})

// focusout: cuando el usuario sale de un campo, validamos solo ese campo
formulario.addEventListener('focusout', (evento) => {
    const campo = evento.target

    if (campo.matches("input:not([type='radio'])") && campo.value !== '') {
        validarCampo(campo)
    }
})

formulario.addEventListener('submit', confirmarPedido)

mostrarMetodo()

// Cargamos los datos
try {
    productos = await obtenerDatos(URL_PRODUCTOS)
    const promociones = await obtenerDatos(URL_PROMOCIONES)
    const inventarioInicial = await obtenerDatos(URL_INVENTARIO)
    inventario = leerInventario(inventarioInicial)

    // Sacamos del carro los productos que ya no existen
    productosEnCarro = leerCarrito().filter((item) => {
        return buscarProducto(item.id)
    })
    resumen = calcularTotales(productosEnCarro, productos, promociones, leerCodigo())

    // Renderizamos
    renderizarPedido()
} catch (error) {
    console.error(error)
    mostrarError(listaPedido, 'No pudimos cargar tu pedido.')
    botonConfirmar.disabled = true
}
