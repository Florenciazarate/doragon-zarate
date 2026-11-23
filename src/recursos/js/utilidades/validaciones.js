// Validaciones-------
// Las reglas estan en el html (required, minlength, maxlength, pattern, type="email")
// Con campo.validity revisamos cual no se cumple y mostramos un mensaje propio

// Caracteres permitidos segun data-solo="..." en el html
const permitidos = {
    numeros: /[^0-9]/g,
    letras: /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]/g,
    tarjeta: /[^0-9 ]/g,
    fecha: /[^0-9/]/g
}

// Borra lo que no esta permitido mientras se escribe (ej: letras en el DNI)
function filtrarEntrada(campo) {
    const regla = permitidos[campo.dataset.solo]

    if (regla) {
        campo.value = campo.value.replace(regla, '')
    }
}

function tarjetaVencida(valor) {
    const [mes, anio] = valor.split('/').map(Number) //<- "05/27" -> [5, 27]
    const hoy = new Date()
    const mesActual = hoy.getMonth() + 1
    const anioActual = hoy.getFullYear() % 100

    return anio < anioActual || (anio === anioActual && mes < mesActual)
}

function mensajeDeError(campo) {
    if (campo.type === 'checkbox') {
        return campo.required && !campo.checked ? 'Tenés que marcar esta casilla para continuar.' : ''
    }

    const valor = campo.value.trim()

    if (valor === '') {
        if (!campo.required) {
            return '' //<- campo opcional vacio
        }
        return campo.tagName === 'SELECT' ? 'Elegí una opción.' : 'Completá este campo.'
    }

    if (campo.validity.typeMismatch) {
        return 'Escribí un email válido, por ejemplo nombre@correo.com.'
    }

    if (valor.length < campo.minLength) {
        const unidad = campo.dataset.solo === 'numeros' ? 'números' : 'caracteres'
        return `Escribí al menos ${campo.minLength} ${unidad}.`
    }

    if (campo.validity.patternMismatch) {
        return campo.title + '.' //<- el title del input explica el formato
    }

    if (campo.id === 'chk-vencimiento' && tarjetaVencida(valor)) {
        return 'La tarjeta está vencida.'
    }

    return '' //<- sin error
}

function mostrarErrorCampo(campo, mensaje) {
    let error = document.getElementById('error-' + campo.id)

    // La primera vez creamos el parrafo del error
    if (!error) {
        error = document.createElement('p')
        error.className = 'error-campo'
        error.id = 'error-' + campo.id

        // Si el campo esta dentro de un label (casilla) o de un grupo, el error va despues de ese contenedor
        const ubicacion = campo.closest('label, .campos') || campo
        ubicacion.after(error)
        campo.setAttribute('aria-describedby', error.id) //<- el lector de pantalla lee el error
    }

    error.textContent = mensaje
    campo.setAttribute('aria-invalid', mensaje !== '' ? 'true' : 'false')
}

function validarCampo(campo) {
    const mensaje = mensajeDeError(campo)
    mostrarErrorCampo(campo, mensaje)
    return mensaje === ''
}

// Valida todos los campos habilitados y muestra un aviso general
function validarFormulario(formulario, aviso) {
    const campos = formulario.querySelectorAll("input:not([type='radio']):not(:disabled), select, textarea")
    const camposInvalidos = []

    campos.forEach((campo) => {
        if (campo.id && !validarCampo(campo)) {
            camposInvalidos.push(campo)
        }
    })

    if (camposInvalidos.length > 0) {
        aviso.textContent = `Revisá los campos marcados en rojo (${camposInvalidos.length}).`
        camposInvalidos[0].focus()
        return false
    }

    aviso.textContent = ''
    return true
}

// Borra los errores (por ejemplo despues de enviar y limpiar el formulario)
function limpiarErrores(formulario) {
    formulario.querySelectorAll('.error-campo').forEach((error) => {
        error.textContent = ''
    })
    formulario.querySelectorAll('[aria-invalid]').forEach((campo) => {
        campo.setAttribute('aria-invalid', 'false')
    })
}

export { filtrarEntrada, validarCampo, validarFormulario, limpiarErrores }
