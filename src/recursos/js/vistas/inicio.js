import { URL_PRODUCTOS, URL_CATEGORIAS, URL_PROBABILIDADES } from '../config.js'
import obtenerDatos, { mostrarError } from '../datos.js'
import { crearTarjeta } from '../componentes/tarjeta.js'
import { abrirDetalle } from './detalle.js'

// Referenciamos elementos del html
const destacados = document.getElementById('destacados')

// Datos de los JSON
let productos = []
let colecciones = []
let probabilidades = {}

// Abre el mismo detalle (popup) que en el catalogo
function mostrarDetalle(id) {
    const producto = productos.find((item) => {
        return item.id === id
    })
    const coleccion = colecciones.find((item) => {
        return item.id === producto.coleccion
    })
    abrirDetalle(producto, coleccion, probabilidades[producto.id])
}

// Eventos
// Escuchamos en main: sirve para "Ver detalle del sobre" y para los titulos de las tarjetas
document.querySelector('main').addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-accion="detalle"]')

    if (boton && productos.length > 0) {
        mostrarDetalle(boton.dataset.id)
    }
})

// Cargamos los datos
try {
    productos = await obtenerDatos(URL_PRODUCTOS)
    probabilidades = await obtenerDatos(URL_PROBABILIDADES)

    const categorias = await obtenerDatos(URL_CATEGORIAS)
    colecciones = categorias.colecciones

    // Filtramos
    const productosDestacados = productos.filter((producto) => {
        return producto.destacado
    })

    // Renderizamos (con detalle: el titulo de cada tarjeta abre el popup)
    let destacadosHTML = ''
    productosDestacados.forEach((producto) => {
        destacadosHTML += crearTarjeta(producto, true)
    })
    destacados.innerHTML = destacadosHTML
} catch (error) {
    console.error(error)
    mostrarError(destacados, 'No pudimos cargar los productos destacados.')
}
