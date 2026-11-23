// async / await
async function obtenerDatos(url) {
    const respuesta = await fetch(url) //<- pedimos un recurso via HTTP -> Response
    if (!respuesta.ok) {
        throw new Error(`No se pudo cargar ${url}`) //<- si falla lo atrapa el catch de cada pagina
    }
    const datos = await respuesta.json() //<- transforma a un objeto javascript
    return datos
}

// Mostramos un aviso en la pagina cuando falla la carga
function mostrarError(contenedor, mensaje) {
    // Dentro de un ul solo puede ir un li
    const etiqueta = contenedor.tagName === 'UL' ? 'li' : 'p'

    contenedor.innerHTML = `
    <${etiqueta} class="error-carga" role="alert">
        ${mensaje} Probá recargar la página en unos minutos.
    </${etiqueta}>
    `
}

export default obtenerDatos
export { mostrarError }
