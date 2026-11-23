// Referenciamos el contador del carrito en la cabecera
const contador = document.querySelector('.cabecera .contador')
const textoOculto = document.querySelector('.cabecera .icono.carrito .solo-lectores')

function fijarContador(cantidad) {
    contador.textContent = cantidad
    textoOculto.textContent = 'Carrito, ' + cantidad + ' productos' //<- lo leen los lectores de pantalla
}

export { fijarContador }
