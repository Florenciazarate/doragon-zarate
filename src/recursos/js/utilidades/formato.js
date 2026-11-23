function formatoPrecio(valor) {
    return '$' + valor.toLocaleString('es-AR')
}

function numeroCarta(numero, total) {
    return String(numero).padStart(3, '0') + '/' + total
}

function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export { formatoPrecio, numeroCarta, normalizar }
