import { fijarContador } from './utilidades/contador.js'
import { leerCarrito, agregarProducto, contarUnidades } from './utilidades/carrito.js'
import { filtrarEntrada, validarCampo, validarFormulario, limpiarErrores } from './utilidades/validaciones.js'

// Contador del carrito con lo guardado en localStorage
fijarContador(contarUnidades(leerCarrito()))

// Botones "Comprar" de las tarjetas: agregan una unidad y siguen al carrito
// Escuchamos en document porque las tarjetas se crean despues con JS
document.addEventListener('click', (evento) => {
    const enlace = evento.target.closest('[data-comprar]')

    if (enlace) {
        agregarProducto(enlace.dataset.comprar, 1)
    }
})

// Referenciamos elementos del html
const formularios = document.querySelectorAll('form[data-mensaje]')
const contadores = document.querySelectorAll('[data-contador-de]')
const actualizadores = []

// Campos con data-solo: borramos lo que no se puede escribir (letras en el DNI, numeros en el nombre)
document.addEventListener('input', (evento) => {
    if (evento.target.dataset.solo) {
        filtrarEntrada(evento.target)
    }
})

formularios.forEach((formulario) => {
    formulario.noValidate = true //<- los errores los mostramos nosotros, no el navegador

    // Aviso general del formulario
    const aviso = document.createElement('p')
    aviso.className = 'aviso-formulario'
    aviso.setAttribute('role', 'alert')
    formulario.append(aviso)

    // Validamos cada campo cuando el usuario sale de el
    formulario.addEventListener('focusout', (evento) => {
        const campo = evento.target

        if (campo.id && campo.matches('input, select, textarea') && campo.value !== '') {
            validarCampo(campo)
        }
    })

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault()

        if (!validarFormulario(formulario, aviso)) {
            return
        }

        let mensaje = formulario.querySelector('.mensaje')

        if (!mensaje) {
            mensaje = document.createElement('p')
            mensaje.className = 'mensaje'
            mensaje.setAttribute('role', 'status')
            formulario.append(mensaje)
        }

        mensaje.textContent = formulario.dataset.mensaje
        formulario.reset()
        limpiarErrores(formulario)
        actualizadores.forEach((actualizar) => actualizar())
    })
})

contadores.forEach((contador) => {
    const campo = document.getElementById(contador.dataset.contadorDe)

    function actualizar() {
        contador.textContent = campo.value.length + ' / ' + campo.maxLength
    }

    campo.addEventListener('input', actualizar)
    actualizadores.push(actualizar)
    actualizar()
})
