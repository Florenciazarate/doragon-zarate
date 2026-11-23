// Barras de progreso de coleccion (se usan en Mi cuenta y en la tirada)
const colores = ['', 'azul', 'verde', 'rojo']

function crearProgreso(progreso) {
    let progresoHTML = ''

    progreso.forEach((item, indice) => {
        progresoHTML += `
        <div>
            <dt>${item.nombre}</dt>
            <dd><progress class="barra ${colores[indice % colores.length]}" value="${item.tengo}" max="${item.total}">${item.tengo} de ${item.total}</progress> ${item.tengo}/${item.total}</dd>
        </div>
        `
    })

    return progresoHTML
}

export { crearProgreso }
