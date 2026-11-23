// Calculos sobre el inventario (no tocan el html, por eso se pueden testear)

function buscarCarta(cartas, id) {
    return cartas.find((carta) => {
        return carta.id === id
    })
}

// Totales para "Mi cuenta": cartas, cartas 5★ y duplicadas
function calcularEstadisticas(inventario, cartas) {
    let total = 0
    let cincoEstrellas = 0
    let duplicadas = 0

    inventario.forEach((item) => {
        const carta = buscarCarta(cartas, item.id)

        total += item.cantidad
        duplicadas += item.cantidad - 1 //<- de cada carta, todas menos una son repetidas

        if (carta.rareza === 5) {
            cincoEstrellas += item.cantidad
        }
    })

    return { total: total, cincoEstrellas: cincoEstrellas, duplicadas: duplicadas }
}

// Por coleccion: cuantas cartas distintas tengo sobre el total de la coleccion
function calcularProgreso(inventario, cartas, colecciones) {
    return colecciones.map((coleccion) => {
        const tengo = inventario.filter((item) => {
            return buscarCarta(cartas, item.id).coleccion === coleccion.id
        }).length

        return { nombre: coleccion.nombre, tengo: tengo, total: coleccion.total }
    })
}

export { calcularEstadisticas, calcularProgreso }
