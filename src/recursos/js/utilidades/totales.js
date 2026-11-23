// Calcula los importes del carro (no toca el html, por eso se puede testear)
function calcularTotales(productosEnCarro, productos, promociones, codigo) {
    let subtotal = 0

    productosEnCarro.forEach((item) => {
        const producto = productos.find((producto) => {
            return producto.id === item.id
        })
        subtotal += producto.precio * item.cantidad
    })

    const porcentaje = promociones.codigosDescuento[codigo] || 0 //<- 0 si el codigo no existe
    const drop = subtotal > 0 ? promociones.descuentoDrop : 0
    const descuentoCodigo = Math.round(subtotal * porcentaje)

    return {
        subtotal: subtotal,
        drop: drop,
        codigo: descuentoCodigo,
        total: subtotal - drop - descuentoCodigo
    }
}

export { calcularTotales }
