import { CLAVE_CARRITO, CLAVE_CODIGO, CLAVE_PEDIDO } from '../config.js'

// Persistencia-------
// localStorage guarda solo cadenas:
// JSON.stringify -> convierte a cadena para guardar
// JSON.parse -> convierte la cadena en objeto al leer

function leerCarrito() {
    const carritoGuardado = localStorage.getItem(CLAVE_CARRITO)

    if (carritoGuardado === null) {
        return [] //<- todavia no hay carrito
    }

    try {
        return JSON.parse(carritoGuardado)
    } catch (error) {
        console.error('Carrito guardado con error', error)
        return []
    }
}

function guardarCarrito(productosEnCarro) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(productosEnCarro))
}

function vaciarCarrito() {
    localStorage.removeItem(CLAVE_CARRITO)
    localStorage.removeItem(CLAVE_CODIGO)
}

function agregarProducto(id, cantidad) {
    const productosEnCarro = leerCarrito()
    const productoEnCarro = productosEnCarro.find((item) => {
        return item.id === id
    })

    // Si ya estaba sumamos la cantidad, si no lo agregamos
    if (productoEnCarro) {
        productoEnCarro.cantidad += cantidad
    } else {
        productosEnCarro.push({ id: id, cantidad: cantidad })
    }

    guardarCarrito(productosEnCarro)
    return productosEnCarro
}

function contarUnidades(productosEnCarro) {
    let unidades = 0

    productosEnCarro.forEach((item) => {
        unidades += item.cantidad
    })

    return unidades
}

function leerCodigo() {
    return localStorage.getItem(CLAVE_CODIGO) || ''
}

function guardarCodigo(codigo) {
    if (codigo === '') {
        localStorage.removeItem(CLAVE_CODIGO)
    } else {
        localStorage.setItem(CLAVE_CODIGO, codigo)
    }
}

function guardarPedido(pedido) {
    localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido))
}

function leerPedido() {
    const pedidoGuardado = localStorage.getItem(CLAVE_PEDIDO)

    if (pedidoGuardado === null) {
        return null
    }

    try {
        return JSON.parse(pedidoGuardado)
    } catch (error) {
        console.error('Pedido guardado con error', error)
        return null
    }
}

export {
    leerCarrito,
    guardarCarrito,
    vaciarCarrito,
    agregarProducto,
    contarUnidades,
    leerCodigo,
    guardarCodigo,
    guardarPedido,
    leerPedido
}
