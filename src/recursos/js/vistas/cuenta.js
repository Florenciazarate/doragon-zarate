import { URL_CARTAS, URL_INVENTARIO, URL_CATEGORIAS } from '../config.js'
import obtenerDatos, { mostrarError } from '../datos.js'
import { numeroCarta } from '../utilidades/formato.js'
import { leerInventario, leerSobresAbiertos } from '../utilidades/coleccion.js'
import { calcularEstadisticas, calcularProgreso } from '../utilidades/estadisticas.js'
import { crearProgreso } from '../componentes/progreso.js'

let cartas = []
let colecciones = []

// Referenciamos elementos del html
const filtro = document.getElementById('filtro-inventario')
const lista = document.getElementById('lista-inventario')
const vacio = document.getElementById('inventario-vacio')
const progresoColeccion = document.getElementById('progreso-coleccion')
const tiradasResumen = document.getElementById('tiradas-resumen')

// Estadisticas calculadas con el inventario real
function renderizarEstadisticas(inventario) {
    const estadisticas = calcularEstadisticas(inventario, cartas)
    const abiertos = leerSobresAbiertos()

    document.getElementById('stat-total').textContent = estadisticas.total
    document.getElementById('stat-cinco').textContent = estadisticas.cincoEstrellas
    document.getElementById('stat-abiertos').textContent = abiertos
    document.getElementById('stat-duplicadas').textContent = estadisticas.duplicadas

    progresoColeccion.innerHTML = crearProgreso(calcularProgreso(inventario, cartas, colecciones))

    if (abiertos > 0) {
        tiradasResumen.textContent = `${abiertos === 1 ? '1 sobre abierto' : abiertos + ' sobres abiertos'} hasta ahora. Abrí uno nuevo cuando quieras.`
    }
}

function crearCarta(item) {
    const carta = cartas.find((registro) => registro.id === item.id)
    const coleccion = colecciones.find((registro) => registro.id === carta.coleccion)
    const repetida = item.cantidad > 1
    const cantidad = repetida ? ` · x${item.cantidad}` : ''

    return `
    <li class="tarjeta-carta vertical" data-rareza="${carta.rareza}" data-duplicada="${repetida}">
      <img src="${carta.imagen}" alt="Carta de ${carta.nombre}" width="293" height="210">
      <h3 class="nombre">${carta.nombre}</h3>
      <p class="detalle">${carta.rareza}★ · ${numeroCarta(carta.numero, coleccion.total)}${cantidad}</p>
    </li>`
}

function mostrarCartas() {
    const elegido = filtro.querySelector('input:checked').value
    let visibles = 0

    ;[...lista.children].forEach((carta) => {
        let mostrar = true

        if (elegido === 'duplicadas') {
            mostrar = carta.dataset.duplicada === 'true'
        } else if (elegido !== 'todas') {
            mostrar = carta.dataset.rareza === elegido
        }

        carta.hidden = !mostrar

        if (mostrar) {
            visibles++
        }
    })

    vacio.hidden = visibles > 0
}

// Eventos
filtro.addEventListener('input', mostrarCartas)

// Cargamos los datos
try {
    cartas = await obtenerDatos(URL_CARTAS)
    const inventarioInicial = await obtenerDatos(URL_INVENTARIO)
    const inventario = leerInventario(inventarioInicial) //<- incluye las cartas de las tiradas
    const categorias = await obtenerDatos(URL_CATEGORIAS)
    colecciones = categorias.colecciones

    lista.innerHTML = inventario.map(crearCarta).join('')
    mostrarCartas()
    renderizarEstadisticas(inventario)
} catch (error) {
    console.error(error)
    mostrarError(lista, 'No pudimos cargar tu inventario.')
}
