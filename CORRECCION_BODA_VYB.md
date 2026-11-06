# VYB — Corrección de la demo de bodas

Este paquete reemplaza los archivos en **la raíz del repositorio `Boda-demo`**. Conserva la arquitectura HTML, CSS y JavaScript de la versión recibida. No toca la web oficial ni el repositorio del taller.

## Cambios respecto al ZIP enviado

- **Visibilidad:** se eliminó el requisito de que un observador de animaciones active la visibilidad de cada sección; las tarjetas, textos, galería y experiencia ahora se muestran incluso si la animación no llega a ejecutarse. Esto corrige grandes áreas vacías que aparecían en la renderización de prueba.
- **Portada:** ahora destaca el arco de ceremonia nupcial en vez de una mesa que parecía de restaurante. Se reubicó la foto de la recepción en la sección de historia.
- **Presentación comercial:** se simplificaron textos que repetían que todo era ficticio, sin ocultar que se trata de una demo; la aclaración sigue en el aviso superior y pie de página.
- **Contacto:** el formulario de muestra identifica claramente que es una vista previa interactiva. Valida campos, pero no finge enviar consultas ni reservas.
- **Conversión comercial:** sección final bilingüe que invita a visitar el sitio oficial de VYB para contratar una web.
- **Lectura móvil:** se incrementó el tamaño de algunos textos de las secciones para facilitar su lectura.
- **Fotos:** las cuatro imágenes locales optimizadas ya no dependen de la carga diferida, para evitar tarjetas aparentemente vacías en el catálogo y la galería.

## Publicar

1. Descargar y descomprimir este ZIP.
2. En GitHub, abrir el repositorio `Boda-demo` (no `Mecanico-demo` ni la web oficial).
3. Reemplazar los archivos de la raíz con los del paquete. Mantener la estructura de `assets/`.
4. Guardar el commit y comprobar `https://lucayuale.github.io/Boda-demo/` con una recarga forzada.

**Nota:** El formulario no envía correos reales hasta que se configure un Formspree propio y se confirmen los destinatarios. Esto es intencional para una demo con un negocio ficticio. Se conservó la configuración segura anterior. Los recursos fotográficos no fueron sustituidos y sus atribuciones siguen en `CREDITOS.md`.

## Verificaciones adicionales

- Ejecutado `node --check` sobre ambos scripts.
- Ejecutado `node tests/verify.mjs`, sin errores.
- Renderizado automatizado a 390 px y 1440 px: sin desbordamiento horizontal ni errores JavaScript.
- Se comprobaron 3 tarjetas, 4 fotos de galería, selector ES/EN, menú móvil, galería ampliable y validación del formulario.
- El formulario real sigue sin envío configurado (no se envía información a terceros).
- No se comprobó directamente el GitHub Pages desplegado: publicar y probar en navegador real.
