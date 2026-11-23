import { CLAVE_SOBRES, CLAVE_INVENTARIO } from '../config.js'

// Persistencia-------
// Sobres comprados que todavia no se abrieron: [{ id, cantidad }]
// Inventario de cartas obtenidas: [{ id, cantidad }]

function leerLista(clave) {
    const guardado = localStorage.getItem(clave)

    if (guardado === null) {
        return null //<- todavia no se guardo nada
    }

    try {
        return JSON.parse(guardado)
    } catch (error) {
        console.error('Lista guardada con error', error)
        return null
    }
}

function sumarALista(lista, id, cantidad) {
    const registro = lista.find((item) => {
        return item.id === id
    })

    if (registro) {
        registro.cantidad += cantidad
    } else {
        lista.push({ id: id, cantidad: cantidad })
    }
}

// Sobres-------
function leerSobres() {
    return leerLista(CLAVE_SOBRES) || []
}

function agregarSobres(sobresComprados) {
    const sobres = leerSobres()

    sobresComprados.forEach((item) => {
        sumarALista(sobres, item.id, item.cantidad)
    })

    localStorage.setItem(CLAVE_SOBRES, JSON.stringify(sobres))
}

// Descuenta un sobre al abrirlo (si llega a 0 se saca de la lista)
function usarSobre(id) {
    const sobres = leerSobres()
        .map((item) => {
            if (item.id === id) {
                return { id: item.id, cantidad: item.cantidad - 1 }
            }
            return item
        })
        .filter((item) => {
            return item.cantidad > 0
        })

    localStorage.setItem(CLAVE_SOBRES, JSON.stringify(sobres))
    return sobres
}

// Inventario-------
// La primera vez arranca con el inventario del JSON (cartas que ya tenia la cuenta)
function leerInventario(inventarioInicial) {
    return leerLista(CLAVE_INVENTARIO) || inventarioInicial
}

// Recibe [{ id, cantidad }]: cartas de una tirada o cartas compradas
function agregarAlInventario(inventario, cartasNuevas) {
    cartasNuevas.forEach((item) => {
        sumarALista(inventario, item.id, item.cantidad)
    })

    localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(inventario))
}

export { leerSobres, agregarSobres, usarSobre, leerInventario, agregarAlInventario }
