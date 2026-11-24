// Menu desplegable del icono de perfil (cabecera)
// En el html el icono es un enlace a cuenta.html: si JS no carga, igual funciona.
// Con JS lo cambiamos por un boton que abre el menu.

const opciones = [
    { texto: 'Mi cuenta', href: './cuenta.html' },
    { texto: 'Inventario de cartas', href: './cuenta.html#inventario' },
    { texto: 'Direcciones de envío', href: './cuenta.html#direcciones' },
    { texto: 'Medios de pago', href: './cuenta.html#pagos' },
    { texto: 'Tiradas', href: './cuenta.html#tiradas' }
]

function crearMenuCuenta() {
    const enlace = document.querySelector('.cabecera .icono.cuenta')

    // Contenedor que reemplaza al enlace
    const contenedor = document.createElement('div')
    contenedor.className = 'menu-cuenta'

    let opcionesHTML = ''
    opciones.forEach((opcion) => {
        opcionesHTML += `<li><a href="${opcion.href}">${opcion.texto}</a></li>`
    })

    contenedor.innerHTML = `
    <button class="icono cuenta" type="button" aria-expanded="false" aria-controls="menu-cuenta">
        <img src="./recursos/imagenes/iconos/cuenta.svg" alt="" width="18" height="18">
        <span class="solo-lectores">Mi cuenta</span>
    </button>
    <ul class="desplegable" id="menu-cuenta" hidden>
        ${opcionesHTML}
        <li class="salir"><a href="./index.html">Cerrar sesión</a></li>
    </ul>
    `

    enlace.replaceWith(contenedor)

    const boton = contenedor.querySelector('button')
    const menu = contenedor.querySelector('.desplegable')

    function cerrar() {
        menu.hidden = true
        boton.setAttribute('aria-expanded', 'false')
    }

    // Eventos
    boton.addEventListener('click', () => {
        const abierto = !menu.hidden
        menu.hidden = abierto
        boton.setAttribute('aria-expanded', String(!abierto))
    })

    // Se cierra al hacer clic afuera o con la tecla Escape
    document.addEventListener('click', (evento) => {
        if (!contenedor.contains(evento.target)) {
            cerrar()
        }
    })

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && !menu.hidden) {
            cerrar()
            boton.focus()
        }
    })

    // En cuenta.html, al elegir una seccion tambien se cierra
    menu.addEventListener('click', (evento) => {
        if (evento.target.closest('a')) {
            cerrar()
        }
    })
}

export { crearMenuCuenta }
