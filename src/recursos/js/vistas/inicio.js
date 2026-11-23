import { URL_PRODUCTOS } from '../config.js'
import obtenerDatos, { mostrarError } from '../datos.js'
import { crearTarjeta } from '../componentes/tarjeta.js'

// Referenciamos elementos del html
const destacados = document.getElementById('destacados')

// Cargamos los datos
try {
    const productos = await obtenerDatos(URL_PRODUCTOS)

    // Filtramos
    const productosDestacados = productos.filter((producto) => {
        return producto.destacado
    })

    // Renderizamos
    let destacadosHTML = ''
    productosDestacados.forEach((producto) => {
        destacadosHTML += crearTarjeta(producto, false)
    })
    destacados.innerHTML = destacadosHTML
} catch (error) {
    console.error(error)
    mostrarError(destacados, 'No pudimos cargar los productos destacados.')
}
