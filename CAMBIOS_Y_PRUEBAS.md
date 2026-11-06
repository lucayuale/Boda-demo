# Cambios y pruebas — Casa Aurelia / Boda-demo

6 de noviembre de 2026. Fuente inspeccionada: Boda-demo-main(1).zip. Se trabajó en una copia nueva, sin modificar el ZIP original, la web oficial, otro proyecto ni repositorios remotos.

## Reemplazar en la raíz de Boda-demo

| Archivo | Cambio |
| --- | --- |
| index.html | Presentación de bodas, metadatos, secciones, formulario y galería |
| styles.css | Identidad marfil/salvia/dorado, responsive y reduced motion |
| app.js | Idiomas persistentes, menú, galería y validación/envío opcional |
| config.js | Marca ficticia, servicios, textos bilingües, fotografías y contactos neutros |
| README.md | Ejecución, configuración y publicación manual |

Se conserva HTML/CSS/JavaScript estático, sin frameworks, paquetes npm ni backend. Se adaptaron las utilidades de enlaces/imágenes/idioma a la nueva experiencia. No hay conexiones a calendarios o cuentas ajenas.

## Agregados

- assets/reception.webp
- assets/ceremony.webp
- assets/flowers.webp
- assets/celebration.webp
- assets/favicon.svg
- .nojekyll
- CREDITOS.md
- CAMBIOS_Y_PRUEBAS.md
- tests/verify.mjs

## ELIMINAR los archivos anteriores en GitHub

- assets/hero.jpg
- assets/manifesto.jpg
- assets/trabajo-1.jpg
- assets/trabajo-2.jpg
- assets/trabajo-3.jpg

Estos cinco archivos no están en el nuevo ZIP. Subir los archivos nuevos no elimina los antiguos. No borrar workflows o configuraciones de hosting que no estaban en el material recibido.

## Automatizadas: aprobadas

- `node tests/verify.mjs`: recursos relativos, anclas, IDs, claves ES/EN, contactos neutros, ausencia de contenido anterior en HTML/CSS/JS/config, rutas seguras y reduced motion.
- Validación de nombre, correo, fecha real presente/futura (incluye años bisiestos), tipo, invitados enteros y longitud del mensaje.
- Configuración pendiente bloquea toda solicitud de red.
- Endpoint Formspree restringido y rechazo de IDs/URLs peligrosos, proveedor incorrecto o activación incompleta.
- Honeypot, payload, aceptación, error, JSON inválido, HTTP 429, desconexión y timeout: pruebas con transporte simulado. Ningún correo real enviado.
- `node --check app.js` y `node --check config.js`.
- ZIP: CRC, archivos directamente en raíz, ausencia de fotos anteriores y extracción nueva para repetir las pruebas.

## Navegador Chrome: ejecutadas

- Previsualización bajo `/Boda-demo/`, con CSS/JS/imágenes relativos funcionando.
- Primera visita EN; cambio inmediato a ES, persistencia tras recargar y atributo lang correcto. Los errores ya visibles cambian de idioma.
- Escritorio inspeccionado visualmente. Vistas de 320, 390, 768 y 1024 px mediante iframe: anchos útiles 305, 375, 753 y 1009, respectivamente. scrollWidth igual a clientWidth en cada caso.
- Menú móvil abre y cierra con Escape; aria-expanded correcto.
- Formulario vacío, correo inválido y fecha pasada muestran errores. Datos válidos muestran explícitamente que no hubo envío ni reserva.
- Galería de cuatro imágenes: ampliación, avance, cierre con Escape y recuperación del foco.
- Consola inspeccionada sin errores atribuibles al sitio. Recursos WebP válidos; imágenes locales comprimidas; en la corrección final se usa carga inmediata para evitar galerías en blanco.
- Fotografías revisadas: mesas de celebración, arco de ceremonia y ramo nupcial. Procedencia y licencia en CREDITOS.md. No se presentan como eventos realizados por Casa Aurelia.

## Peso y pendientes

Fotos originales: unos 24,7 MB. Cuatro fotografías WebP nuevas: aproximadamente 0,97 MB. Fuentes de sistema, sin dependencias ni recursos fotográficos remotos en ejecución. No se midieron Lighthouse/Core Web Vitals reales.

El formulario está desactivado hasta configurar una cuenta propia. No hay correo, dirección, teléfono o Instagram ficticios. No se efectuó un envío real ni se confirmó una fecha.

No se publicó la nueva versión. La URL pública conservará su contenido previo hasta reemplazar los archivos y completar GitHub Pages. La prueba del prefijo fue local; no se afirma una nueva publicación remota.

Pendiente: publicación manual, prueba en dispositivos físicos/Safari, revisión de datos reales y prueba de recepción del proveedor si se activa. No se certifica una auditoría completa WCAG. La demo se identifica como ficticia y usa noindex para no presentarse como un negocio real.


## Corrección posterior (6/11/2026)

Ver `CORRECCION_BODA_VYB.md` para las correcciones de visibilidad, portada, textos, CTA de VYB y carga de imágenes. La ejecución anterior describía el ZIP original; esta entrega contiene cambios adicionales comprobados mediante las pruebas de `tests/verify.mjs`.
