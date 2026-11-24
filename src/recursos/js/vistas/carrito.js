import { URL_PRODUCTOS, URL_PROMOCIONES } from '../config.js'
import obtenerDatos, { mostrarError } from '../datos.js'
import { formatoPrecio } from '../utilidades/formato.js'
import { fijarContador } from '../utilidades/contador.js'
import { calcularTotales } from '../utilidades/totales.js'
import { leerCarrito, guardarCarrito, contarUnidades, leerCodigo, guardarCodigo } from '../utilidades/carrito.js'

// Leemos el carro guardado en localStorage
let items = leerCarrito()
let codigoAplicado = leerCodigo()

// Datos de los JSON
let productos = []
let promociones = { descuentoDrop: 0, codigosDescuento: {} }

// Referenciamos elementos del html
const lista = document.getElementById('lista-carrito')
const titulo = document.getElementById('cantidad-items')
const vacio = document.getElementById('carrito-vacio')
const totales = document.getElementById('totales')
const irAlPago = document.getElementById('ir-pago')
const seguirComprando = document.getElementById('seguir-comprando')
const formularioDescuento = document.getElementById('form-descuento')
const campoCodigo = document.getElementById('codigo')
const mensajeDescuento = document.getElementById('mensaje-descuento')

function buscarProducto(id) {
    return productos.find((producto) => producto.id === id)
}

function crearItem(item) {
    const producto = buscarProducto(item.id)

    return `
    <li class="item" data-id="${producto.id}">
      <img src="${producto.imagen}" alt="${producto.nombre}" width="134" height="184">
      <div>
        <h3>${producto.nombre}</h3>
        <p class="detalle">${producto.detalle}</p>
      </div>
      <div class="campo">
        <label class="solo-lectores" for="cantidad-${producto.id}">Cantidad de ${producto.nombre}</label>
        <input type="number" id="cantidad-${producto.id}" min="1" max="${producto.stock}" value="${item.cantidad}">
      </div>
      <div class="importe">
        <p class="precio">${formatoPrecio(producto.precio * item.cantidad)}</p>
        <button class="boton secundario chico" type="button" data-accion="quitar" data-id="${producto.id}">Quitar</button>
      </div>
    </li>`
}

function mostrarTotales() {
    const resumen = calcularTotales(items, productos, promociones, codigoAplicado)
    const unidades = contarUnidades(items)

    const lineaDrop =
        resumen.drop > 0 ? `<div><dt>Descuento drop</dt><dd>−${formatoPrecio(resumen.drop)}</dd></div>` : ''

    const lineaCodigo =
        codigoAplicado !== '' && resumen.codigo > 0
            ? `<div><dt>Código ${codigoAplicado}</dt><dd>−${formatoPrecio(resumen.codigo)}</dd></div>`
            : ''

    totales.innerHTML = `
    <div><dt>Subtotal</dt><dd>${formatoPrecio(resumen.subtotal)}</dd></div>
    <div><dt>Envío</dt><dd>Gratis</dd></div>
    ${lineaDrop}
    ${lineaCodigo}
    <div class="total"><dt>Total</dt><dd>${formatoPrecio(resumen.total)}</dd></div>`

    titulo.textContent = unidades
    vacio.hidden = items.length > 0
    irAlPago.hidden = items.length === 0
    seguirComprando.hidden = items.length === 0 //<- sin productos no tiene sentido "seguir"
    fijarContador(unidades)
}

function cambiarCantidad(id, valor) {
    const item = items.find((registro) => registro.id === id)
    const producto = buscarProducto(id)

    item.cantidad = Math.min(Math.max(valor || 1, 1), producto.stock)
    guardarCarrito(items)

    const fila = lista.querySelector(`[data-id="${id}"]`)
    fila.querySelector('input').value = item.cantidad
    fila.querySelector('.precio').textContent = formatoPrecio(producto.precio * item.cantidad)

    mostrarTotales()
}

function quitarItem(id) {
    const posicion = items.findIndex((registro) => registro.id === id)
    items.splice(posicion, 1)
    guardarCarrito(items)
    lista.querySelector(`[data-id="${id}"]`).remove()
    mostrarTotales()
}

function aplicarCodigo(evento) {
    evento.preventDefault()

    const codigo = campoCodigo.value.trim().toUpperCase()

    const porcentaje = promociones.codigosDescuento[codigo]

    if (porcentaje) {
        codigoAplicado = codigo
        mensajeDescuento.textContent = `Código aplicado: ${porcentaje * 100}% de descuento.`
    } else {
        codigoAplicado = ''
        mensajeDescuento.textContent = 'El código no es válido.'
    }

    guardarCodigo(codigoAplicado)
    mostrarTotales()
}

// Eventos
lista.addEventListener('change', (evento) => {
    const fila = evento.target.closest('[data-id]')

    if (fila && evento.target.type === 'number') {
        cambiarCantidad(fila.dataset.id, Number(evento.target.value))
    }
})

lista.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-accion="quitar"]')

    if (boton) {
        quitarItem(boton.dataset.id)
    }
})

formularioDescuento.addEventListener('submit', aplicarCodigo)

// Cargamos los datos
try {
    productos = await obtenerDatos(URL_PRODUCTOS)
    promociones = await obtenerDatos(URL_PROMOCIONES)

    // Sacamos del carro los productos que ya no existen
    items = items.filter((item) => buscarProducto(item.id))
    guardarCarrito(items)

    lista.innerHTML = items.map(crearItem).join('')
    mostrarTotales()

    if (codigoAplicado !== '') {
        campoCodigo.value = codigoAplicado
        mensajeDescuento.textContent = `Código aplicado: ${promociones.codigosDescuento[codigoAplicado] * 100}% de descuento.`
    }
} catch (error) {
    console.error(error)
    mostrarError(lista, 'No pudimos cargar tu carrito.')
    irAlPago.hidden = true
}
