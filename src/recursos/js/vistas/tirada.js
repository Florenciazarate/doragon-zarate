import { URL_PRODUCTOS, URL_PROBABILIDADES, URL_CARTAS, URL_INVENTARIO, URL_CATEGORIAS } from '../config.js'
import obtenerDatos, { mostrarError } from '../datos.js'
import { sortearRareza, elegirAlAzar } from '../utilidades/sorteo.js'
import { numeroCarta } from '../utilidades/formato.js'
import { leerSobres, usarSobre, leerInventario, agregarAlInventario } from '../utilidades/coleccion.js'

const cartasPorSobre = 5

// Referenciamos elementos del html
const apertura = document.getElementById('apertura')
const resultado = document.getElementById('resultado')

// Datos de los JSON (se cargan al final con fetch)
let productos = []
let probabilidades = {}
let cartas = []
let inventario = []
let colecciones = []
let nombresRareza = {}

// Sobre que se esta abriendo
let sobre = null
let tabla = []

function cantidadEnInventario(id) {
    const item = inventario.find((registro) => registro.id === id)
    return item ? item.cantidad : 0
}

function buscarProducto(id) {
    return productos.find((producto) => {
        return producto.id === id
    })
}

// Apertura-------
// Solo se pueden abrir los sobres comprados (guardados en localStorage)
function renderizarApertura() {
    const sobres = leerSobres()

    if (sobres.length === 0) {
        apertura.innerHTML = `
        <section class="apertura tarjeta" aria-labelledby="apertura-titulo">
            <p class="etiqueta naranja">Sin sobres</p>
            <h2 id="apertura-titulo" tabindex="-1">No tenés sobres para abrir</h2>
            <p class="subtitulo">Comprá un sobre en el catálogo y después volvé acá para abrirlo.</p>
            <a class="boton primario" href="./catalogo.html">Ir al catálogo</a>
        </section>
        `
        return
    }

    let sobresHTML = ''

    sobres.forEach((item) => {
        const producto = buscarProducto(item.id)

        sobresHTML += `
        <li class="sobre-disponible">
            <img src="${producto.imagen}" alt="${producto.nombre}" width="134" height="184">
            <h3>${producto.nombre}</h3>
            <p class="subtitulo">${item.cantidad === 1 ? '1 disponible' : item.cantidad + ' disponibles'}</p>
            <button class="boton primario" type="button" data-abrir="${producto.id}">Abrir sobre</button>
        </li>
        `
    })

    apertura.innerHTML = `
    <section class="apertura tarjeta" aria-labelledby="apertura-titulo">
        <p class="etiqueta naranja">Listo para abrir</p>
        <h2 id="apertura-titulo" tabindex="-1">Tus sobres</h2>
        <p class="subtitulo">${cartasPorSobre} cartas por sobre. Elegí cuál querés abrir.</p>
        <ul class="sobres-disponibles">${sobresHTML}</ul>
    </section>
    `
}

function sortearCarta() {
    const rareza = sortearRareza(tabla)
    // soloTienda: cartas que se venden sueltas y no salen en los sobres
    const candidatas = cartas.filter((carta) => {
        return carta.rareza === rareza && carta.coleccion === sobre.coleccion && !carta.soloTienda
    })
    return elegirAlAzar(candidatas)
}

function abrirSobre() {
    const obtenidas = []

    for (let i = 0; i < cartasPorSobre; i++) {
        const carta = sortearCarta()
        const repetidas = obtenidas.filter((item) => item.carta.id === carta.id).length
        const duplicada = cantidadEnInventario(carta.id) + repetidas > 0
        obtenidas.push({ carta, duplicada })
    }

    return obtenidas
}

function elegirPrincipal(obtenidas) {
    let mejor = obtenidas[0]

    obtenidas.forEach((item) => {
        if (item.carta.rareza > mejor.carta.rareza) {
            mejor = item
        }
    })

    return mejor
}

function crearPrincipal(item, obtenidas) {
    const carta = item.carta
    const coleccion = colecciones.find((registro) => registro.id === carta.coleccion)
    const porcentaje = tabla.find((opcion) => opcion.rareza === carta.rareza).porcentaje
    const enInventario =
        cantidadEnInventario(carta.id) + obtenidas.filter((registro) => registro.carta.id === carta.id).length
    const estado = item.duplicada ? 'Duplicada' : 'Nueva en tu colección'
    const descripcion = item.duplicada
        ? 'Ya tenías esta carta. No tiene reembolso del 100%, pero podés canjearla por crédito parcial.'
        : 'Ya está acreditada en tu inventario y podés pedir el envío cuando completes la colección.'

    return `
    <section class="revelacion" aria-labelledby="reveal-titulo">
      <div class="texto">
        <h2 id="reveal-titulo" tabindex="-1">¡Obtuviste una ${carta.rareza}★!</h2>
        <h3>${carta.nombre}</h3>
        <p class="rasgos">${nombresRareza[carta.rareza]} · ${coleccion.nombre} · ${numeroCarta(carta.numero, coleccion.total)} · ${estado.toLowerCase()}</p>
        <p class="descripcion">${descripcion}</p>

        <dl class="datos">
          <div>
            <dt>En inventario</dt>
            <dd>${enInventario}</dd>
          </div>
          <div>
            <dt>Colección</dt>
            <dd>${coleccion.nombre}</dd>
          </div>
          <div>
            <dt>Rareza</dt>
            <dd>${porcentaje}%</dd>
          </div>
          <div>
            <dt>N° de carta</dt>
            <dd>${numeroCarta(carta.numero, coleccion.total)}</dd>
          </div>
        </dl>

        <p class="acciones">
          ${crearBotonOtro()}
          <a class="enlace" href="cuenta.html#inventario">Ver mi inventario</a>
        </p>
      </div>

      <img src="${carta.imagen}" alt="Carta de ${carta.nombre}" width="172" height="316">
    </section>`
}

function crearBotonOtro() {
    if (leerSobres().length === 0) {
        return `<a class="boton amarillo" href="./catalogo.html">Comprar más sobres</a>`
    }
    return `<button class="boton amarillo" type="button" data-accion="otro">Abrir otro sobre</button>`
}

function crearResto(resto, obtenidas) {
    const duplicadas = obtenidas.filter((item) => item.duplicada).length
    const acreditadas = obtenidas.length - duplicadas

    return `
    <section class="resto seccion" aria-labelledby="resto-titulo">
      <div class="encabezado">
        <h2 id="resto-titulo">Resto del sobre</h2>
        <p class="subtitulo">${acreditadas} acreditadas · ${duplicadas} duplicadas entre las ${obtenidas.length} cartas del sobre.</p>
      </div>

      <ul class="grilla">
        ${resto
            .map(
                (item) => `
          <li class="tarjeta-carta">
            <img src="${item.carta.imagen}" alt="Carta de ${item.carta.nombre}" width="293" height="210">
            <h3 class="nombre">${item.carta.nombre}</h3>
            <p class="detalle">${item.carta.rareza}★ · ${item.duplicada ? 'duplicada' : 'acreditada'}</p>
          </li>`
            )
            .join('')}
      </ul>
    </section>`
}

function mostrarResultado(id) {
    sobre = buscarProducto(id)
    tabla = probabilidades[id]

    usarSobre(id) //<- descontamos el sobre abierto

    const obtenidas = abrirSobre()
    const destacada = elegirPrincipal(obtenidas)
    const resto = obtenidas.filter((item) => item !== destacada)
    const numeroPedido = 'DR-' + Math.floor(10000 + Math.random() * 90000)

    resultado.innerHTML = `
    <section class="estado tarjeta" aria-labelledby="estado-titulo">
      <p class="etiqueta naranja">Apertura completada</p>
      <h2 id="estado-titulo">Sobre #${numeroPedido}</h2>
      <p class="subtitulo">${sobre.nombre}</p>
    </section>
    ${crearPrincipal(destacada, obtenidas)}
    ${crearResto(resto, obtenidas)}`

    // Las cartas obtenidas se suman al inventario (localStorage)
    agregarAlInventario(
        inventario,
        obtenidas.map((item) => {
            return { id: item.carta.id, cantidad: 1 }
        })
    )

    apertura.hidden = true
    resultado.hidden = false
    resultado.querySelector('#reveal-titulo').focus()
}

// Eventos
apertura.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-abrir]')

    if (boton) {
        mostrarResultado(boton.dataset.abrir)
    }
})

resultado.addEventListener('click', (evento) => {
    if (evento.target.dataset.accion === 'otro') {
        // Volvemos a la lista de sobres
        renderizarApertura()
        resultado.hidden = true
        apertura.hidden = false
        apertura.querySelector('h2').focus()
    }
})

// Cargamos los datos
try {
    productos = await obtenerDatos(URL_PRODUCTOS)
    probabilidades = await obtenerDatos(URL_PROBABILIDADES)
    cartas = await obtenerDatos(URL_CARTAS)

    const inventarioInicial = await obtenerDatos(URL_INVENTARIO)
    const categorias = await obtenerDatos(URL_CATEGORIAS)

    inventario = leerInventario(inventarioInicial)
    colecciones = categorias.colecciones
    nombresRareza = categorias.nombresRareza

    // Renderizamos
    renderizarApertura()
} catch (error) {
    console.error(error)
    mostrarError(apertura, 'No pudimos preparar la apertura de sobres.')
}
