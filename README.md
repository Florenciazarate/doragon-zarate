# Doragon · Tienda de cartas coleccionables

Proyecto individual para el IEFI de **Aplicaciones Web 1** (IES Siglo 21, comisión MB).
Tienda online de sobres y cartas: catálogo con filtros, carrito persistente, pago con envío del pedido por WhatsApp, apertura de los sobres comprados e inventario de cartas.

- **Sitio publicado:** _(completar con el link de Vercel)_
- **Repositorio:** https://github.com/Florenciazarate/doragon-zarate

## Cómo ejecutarlo

```bash
pn install     # instala five-server
pn dev         # levanta el sitio (carpeta src)
pn test        # corre los tests (node --test)
```

> El sitio se abre con un servidor (no con doble clic en el HTML) porque los datos se cargan con `fetch` desde archivos JSON.

## Estructura

```
src/                          páginas HTML
src/recursos/datos/           archivos JSON (productos, cartas, inventario, categorías, probabilidades, promociones)
src/recursos/estilos/         hojas de estilo
src/recursos/imagenes/        imágenes e íconos
src/recursos/js/config.js     rutas de los JSON, número de WhatsApp y claves de localStorage
src/recursos/js/datos.js      obtenerDatos(url) con fetch
src/recursos/js/utilidades/   funciones reutilizables (formato, sorteo, totales, carrito, pedido,
                              validaciones, colección y estadísticas)
src/recursos/js/componentes/  tarjeta de producto, panel del carrito y barras de progreso
src/recursos/js/vistas/       un módulo por página
src/recursos/js/comun.js      se carga en todas las páginas
tests/                        tests con el test runner nativo de Node
.github/workflows/            CI/CD (tests + despliegue en Vercel)
```

## Funcionamiento

1. **Catálogo:** filtros por tipo, colección, rareza, precio y stock; búsqueda (también desde otras páginas) con aviso si no hay resultados.
2. **Agregar al carrito:** desde las tarjetas, sin salir de la página. Se abre un panel con lo que hay en el carrito. No permite superar el stock.
3. **Carrito:** se guarda en `localStorage`, así se mantiene al cambiar de página o recargar.
4. **Pago:** validaciones HTML + JavaScript con mensajes por campo; los campos no aceptan caracteres inválidos (letras en el DNI, números en el nombre).
5. **Envío:** al confirmar se arma el mensaje del pedido y se abre WhatsApp (`wa.me`) con el texto listo.
6. **Confirmación:** número de pedido, total y entrega estimada.
7. **Tirada:** solo se pueden abrir los sobres comprados. Las cartas obtenidas se suman al inventario y se puede compartir el resultado.
8. **Mi cuenta:** inventario (cartas compradas + cartas de las tiradas) con estadísticas y progreso calculados en base a los datos reales.

## CI/CD

El workflow `.github/workflows/ci-cd.yml` se ejecuta en cada push a `main`:

1. **CI:** instala Node y corre `npm test`.
2. **CD:** si los tests pasan, publica en Vercel en 3 pasos: `vercel pull` → `vercel build` → `vercel deploy --prebuilt`.

Secretos necesarios en GitHub (Settings → Secrets and variables → Actions): `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
