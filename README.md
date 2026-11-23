# Doragon · Tienda de cartas coleccionables

Proyecto individual para el IEFI de **Aplicaciones Web 1** (IES Siglo 21, comisión MB).
Tienda online de sobres y cartas con catálogo filtrable, carrito persistente, pago con envío del pedido por WhatsApp y apertura de sobres.

- **Sitio publicado:** _(completar con el link de Vercel)_
- **Repositorio:** _(completar con el link de GitHub)_

## Cómo ejecutarlo en la computadora

```bash
pn install     # instala five-server
pn dev         # levanta el sitio (carpeta src)
pn test        # corre los tests (node --test)
```

> El sitio se tiene que abrir con un servidor (no con doble clic en el HTML), porque los datos se cargan con `fetch` desde archivos JSON.

## Estructura

```
src/                          páginas HTML
src/recursos/datos/           archivos JSON (productos, cartas, inventario, categorías, probabilidades, promociones)
src/recursos/estilos/         hojas de estilo
src/recursos/imagenes/        imágenes e íconos
src/recursos/js/config.js     rutas de los JSON, número de WhatsApp y claves de localStorage
src/recursos/js/datos.js      obtenerDatos(url) con fetch
src/recursos/js/utilidades/   funciones reutilizables (formato, sorteo, totales, carrito, pedido)
src/recursos/js/componentes/  tarjeta de producto
src/recursos/js/vistas/       un módulo por página
src/recursos/js/comun.js      se carga en todas las páginas
tests/                        tests con el test runner de Node
.github/workflows/            CI/CD (tests + despliegue en Vercel)
```

## Flujo de compra

1. **Catálogo:** filtros por tipo, colección, rareza, precio y stock; búsqueda; detalle en ventana modal.
2. **Carrito:** se guarda en `localStorage`, así se mantiene al cambiar de página o recargar.
3. **Pago:** validaciones HTML + JavaScript con mensajes por campo.
4. **Envío:** al confirmar se arma el mensaje del pedido y se abre WhatsApp (`wa.me`) con el texto listo.
5. **Confirmación:** muestra el número de pedido, el total y la entrega estimada, y permite reenviar por WhatsApp.

## CI/CD

El workflow `.github/workflows/ci-cd.yml` se ejecuta en cada push a `main`:

1. **CI:** instala Node y corre `npm test`.
2. **CD:** si los tests pasan, publica el sitio en Vercel con la CLI.

Secretos necesarios en GitHub (Settings → Secrets and variables → Actions): `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
