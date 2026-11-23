import { formatoPrecio } from '../utilidades/formato.js'
import { fijarContador } from '../utilidades/contador.js'
import { agregarProducto, contarUnidades, leerCarrito } from '../utilidades/carrito.js'

// Referenciamos elementos del html
const ventana = document.getElementById('detalle')
let producto = null
let coleccion = null
let tabla = null
let cantidad = 1

function crearProbabilidades() {
    if (!tabla) {
        return `<p class="subtitulo">Venta directa: sin azar, recibís exactamente la carta publicada.</p>`
    }

    return `
    <div class="probabilidades">
      <h3>Probabilidades por rareza</h3>
      <ul>
        ${tabla
            .map(
                (opcion) => `
          <li>
            <span>${opcion.rareza}★</span>
            <progress class="barra" max="100" value="${opcion.porcentaje}">${opcion.porcentaje}%</progress>
            <span>${opcion.porcentaje}%</span>
          </li>`
            )
            .join('')}
      </ul>
    </div>`
}

function crearAcciones() {
    if (producto.stock === 0) {
        return `<a class="boton tenue" href="nosotros.html#contacto">Avisame cuando vuelva</a>`
    }

    // Sobres y cartas pasan por el carrito y el pago
    return `
    <button class="boton primario" type="button" data-accion="comprar">Comprar</button>
    <button class="boton secundario" type="button" data-accion="agregar">Agregar al carrito</button>`
}

function crearContenido() {
    const stock = producto.stock === 0 ? 'Sin stock' : producto.stock + ' disponibles'
    const bloqueado = producto.stock === 0 ? 'disabled' : ''

    return `
    <div class="contenido-detalle">
      <img src="${producto.imagen}" alt="${producto.nombre}" width="134" height="184">

      <div class="informacion">
        <button class="cerrar" type="button" data-accion="cerrar" aria-label="Cerrar detalle">×</button>

        <p class="etiquetas">
          <span class="etiqueta">Colección ${coleccion.nombre}</span>
          <span class="etiqueta">${producto.rareza}★ posible</span>
        </p>

        <h2 id="detalle-titulo">${producto.nombre}</h2>
        <p class="subtitulo">${producto.descripcion}</p>

        ${crearProbabilidades()}

        <p class="stock">${stock}</p>

        <div class="compra">
          <p class="total" aria-live="polite" data-total>${formatoPrecio(producto.precio)}</p>

          <div class="cantidad">
            <button type="button" data-accion="menos" aria-label="Restar uno" ${bloqueado}>−</button>
            <label class="solo-lectores" for="detalle-cantidad">Cantidad</label>
            <input type="number" id="detalle-cantidad" min="1" max="${Math.max(producto.stock, 1)}" value="1" ${bloqueado}>
            <button type="button" data-accion="mas" aria-label="Sumar uno" ${bloqueado}>+</button>
          </div>

          ${crearAcciones()}
        </div>

        <p class="mensaje" role="status"></p>
      </div>
    </div>`
}

function cambiarCantidad(nueva) {
    const maximo = Math.max(producto.stock, 1)
    cantidad = Math.min(Math.max(nueva || 1, 1), maximo)

    ventana.querySelector('#detalle-cantidad').value = cantidad
    ventana.querySelector('[data-total]').textContent = formatoPrecio(producto.precio * cantidad)
}

function agregarAlCarrito() {
    const sumadas = agregarProducto(producto.id, cantidad, producto.stock)
    fijarContador(contarUnidades(leerCarrito()))
    ventana.querySelector('.mensaje').textContent = crearMensaje(sumadas)
}

// Mensaje segun cuantas unidades se pudieron sumar
function crearMensaje(sumadas) {
    if (sumadas === 0) {
        return `Ya tenés en el carrito todo el stock disponible de ${producto.nombre}.`
    }
    if (sumadas < cantidad) {
        return `Solo quedaban ${sumadas} disponibles: agregamos ${sumadas} × ${producto.nombre} al carrito.`
    }
    return `Agregaste ${cantidad} × ${producto.nombre} al carrito.`
}

function comprarAhora() {
    agregarProducto(producto.id, cantidad, producto.stock) //<- si no hay mas stock igual vamos al carrito
    window.location.href = 'carrito.html'
}

// Recibe el producto y sus datos desde catalogo.js
function abrirDetalle(productoElegido, coleccionDelProducto, tablaProbabilidades) {
    producto = productoElegido
    coleccion = coleccionDelProducto
    tabla = tablaProbabilidades
    cantidad = 1
    ventana.innerHTML = crearContenido()
    ventana.showModal()
}

// Eventos
ventana.addEventListener('click', (evento) => {
    if (evento.target === ventana) {
        ventana.close()
        return
    }

    const boton = evento.target.closest('[data-accion]')

    if (!boton) {
        return
    }

    const accion = boton.dataset.accion

    if (accion === 'cerrar') {
        ventana.close()
    } else if (accion === 'mas') {
        cambiarCantidad(cantidad + 1)
    } else if (accion === 'menos') {
        cambiarCantidad(cantidad - 1)
    } else if (accion === 'agregar') {
        agregarAlCarrito()
    } else if (accion === 'comprar') {
        comprarAhora()
    }
})

ventana.addEventListener('change', (evento) => {
    if (evento.target.id === 'detalle-cantidad') {
        cambiarCantidad(Number(evento.target.value))
    }
})

export { abrirDetalle }
