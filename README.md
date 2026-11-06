# Casa Aurelia — Weddings & Events · Demo VYB

Corrección del repositorio `lucayuale/Boda-demo`. Página estática bilingüe de bodas y eventos, con marca y servicios ficticios. Reemplaza la presentación anterior y utiliza exclusivamente recursos de celebraciones. No se modificó la web oficial de VYB ni otro repositorio.

## Ejecutar en Windows con PowerShell

Guardar el ZIP en Descargas y extraerlo por completo:

```powershell
Expand-Archive -LiteralPath "$HOME\Downloads\VYB_BODA_DEMO_LISTO_PARA_GITHUB.zip" -DestinationPath "$HOME\Downloads\VYB_BODA_DEMO"
Set-Location "$HOME\Downloads\VYB_BODA_DEMO"
py -m http.server 8097 --bind 127.0.0.1
```

Abrir http://127.0.0.1:8097/ . Dejar PowerShell abierto; Ctrl+C detiene el servidor. Requiere Python. Si ese puerto está ocupado, elegir otro y cambiarlo también en el navegador. No abrir la página desde el interior del ZIP.

No necesita `npm install`, framework, backend ni compilación. Publicar los archivos de la raíz tal como se entregan.

## Contenido y configuración

- `index.html`: estructura semántica y contenido inicial inglés.
- `styles.css`: identidad editorial marfil, salvia y dorado; responsive y reduced motion.
- `app.js`: idiomas, navegación, galería, validación y envío opcional.
- `config.js`: marca, colores, servicios, imágenes, textos, contactos y configuración del formulario.
- `assets/`: cuatro imágenes WebP locales y favicon SVG.
- `tests/verify.mjs`: verificaciones técnicas reproducibles, sin envíos reales.
- `CREDITOS.md`: procedencia y licencia de las fotografías.
- `CAMBIOS_Y_PRUEBAS.md`: cambios, eliminaciones y alcance de las pruebas.
- `.nojekyll`: publicación estática directa en GitHub Pages.

Para adaptar a un cliente editar `config.js`:

- `business.name`, `business.tagline`: nombre y subtítulo ES/EN.
- `business.logo`: ruta local opcional, por ejemplo `assets/logo.webp`. Si está vacío se utiliza el monograma tipográfico.
- `brand.colors`: colores hexadecimales de la identidad; comprobar contraste después de cambiarlos.
- `images`: rutas locales, textos alternativos y epígrafes ES/EN. Guardar los archivos en assets.
- `services`: tres tipos de celebración, descripción, ID y foto. Los servicios generan también las opciones del formulario; no es necesario editar ambas partes.
- `experiences`: títulos y descripciones ES/EN.
- `contact.email`, `contact.address`, `contact.instagram`: datos reales cuando existan. Los valores vacíos se ocultan. No hay teléfonos ni perfiles ficticios.
- `contact.form`: proveedor/ID público y activación descrita más abajo.
- `seo`: título, descripción y canonical. Si cambia el nombre o dominio para otro cliente, actualizar también los metadatos iniciales de index.html antes de publicar; los navegadores usan la configuración dinámica, pero los rastreadores sociales suelen leer únicamente HTML inicial.
- `language.storageKey`: usar una clave distinta en un cliente nuevo para aislar preferencias.

La primera visita abre en inglés. El selector cambia a español sin recargar y guarda la preferencia; no se usa ubicación ni idioma automático del navegador. Se traduce todo el contenido generado, errores, epígrafes y controles. Los controles nativos de fecha/número pueden usar la apariencia y el formato del sistema del visitante.

La galería amplía imágenes, permite anterior/siguiente, flechas del teclado, cierre con Escape y recuperación de foco. El menú móvil tiene estado accesible y cierre con Escape.

## Formulario: estado real

**El envío está desactivado en esta demostración.** No se conectó a cuentas de otras demos ni a una agenda. El botón “Check my enquiry / Revisar mi consulta” valida campos y aclara que no se ha enviado nada ni reservado una fecha. No hay confirmaciones simuladas.

Validaciones: nombre de 2–100 caracteres, correo, fecha real de hoy en adelante, tipo de celebración, invitados enteros de 1 a 5000 y mensaje opcional de hasta 2000 caracteres. El límite de invitados es una validación orientativa de formulario, no capacidad del espacio. Una consulta nunca confirma disponibilidad.

### Activar Formspree para un negocio real

1. Crear una cuenta y un formulario propios del negocio en Formspree.
2. Configurar y confirmar allí el correo destinatario real. Revisar cuotas, antispam, dominios y requisitos del proveedor.
3. Copiar únicamente el identificador público del formulario; nunca contraseñas, claves privadas o tokens administrativos.
4. En `config.js`, completar `contact.form.formId`, conservar `provider: "formspree"` y poner `enabled: true`, `recipientConfirmed: true` solo después de verificar la cuenta.
5. Si se desea correo directo, completar `contact.email`. Ese correo visible no reemplaza la configuración de destinatario en Formspree.
6. Publicar y realizar una consulta controlada. Confirmar recepción, spam y errores desde el dominio final.

El endpoint se construye como `https://formspree.io/f/<ID>`; no se permite una URL arbitraria. Se incluye honeypot, control de doble envío, espera máxima de 15 segundos, mensajes de error, HTTP 429 y desconexión. Los campos permanecen en pantalla ante fallos. La aceptación del proveedor no garantiza entrega en la bandeja ni disponibilidad de la fecha.

Si Formspree exige CAPTCHA, integrar y probar su flujo oficial antes de activar; esta entrega no agrega ni desactiva un CAPTCHA. La protección del navegador no sustituye la del proveedor. Revisar sus condiciones vigentes: no se promete un servicio gratuito ilimitado.

No hay base de datos propia ni datos personales guardados en localStorage. El proveedor externo puede procesar y conservar consultas conforme a su privacidad. El formulario informa esto y enlaza su política. No se efectuaron envíos reales en las pruebas.

## Actualizar Boda-demo desde GitHub

1. Descargar y extraer este ZIP; **no subir el ZIP comprimido**.
2. Abrir el repositorio `lucayuale/Boda-demo`, confirmar la rama que publica GitHub Pages y hacer un respaldo/commit previo.
3. Reemplazar en la raíz: `index.html`, `styles.css`, `app.js`, `config.js`, `README.md`.
4. Eliminar los cinco archivos antiguos de `assets/` listados en CAMBIOS_Y_PRUEBAS.md. Subir los cuatro WebP y favicon nuevos conservando la carpeta assets.
5. Agregar `.nojekyll`, `CREDITOS.md`, `CAMBIOS_Y_PRUEBAS.md` y `tests/verify.mjs`. No borrar archivos de hosting o workflows ajenos a esta entrega sin revisarlos.
6. En GitHub se puede usar Add file → Upload files y arrastrar los archivos y carpetas extraídos; confirmar los cambios. Para cada imagen antigua: abrir el archivo, usar Delete file y confirmar. Subir archivos nuevos por sí solo **no elimina** los anteriores.
7. Settings → Pages: mantener la rama publicada correcta y carpeta `/ (root)`. Si todavía no estuviera configurado, seleccionar Deploy from a branch → main → `/ (root)` → Save, siempre que main sea la rama elegida.
8. Esperar al despliegue y abrir `https://lucayuale.github.io/Boda-demo/`. Hacer Ctrl+F5 y revisar la ejecución de Pages si se sigue viendo la versión antigua.

No crear un nivel adicional `Boda-demo-main/` o `final/` dentro del repositorio. `index.html` debe quedar directamente en su raíz. CSS, JS y fotografías utilizan rutas relativas; se comprobó la previsualización bajo `/Boda-demo/`.

La URL pública no se modificó durante esta entrega. El nuevo contenido aparecerá cuando el propietario reemplace los archivos y GitHub Pages complete el despliegue. No se tocó el catálogo de la web oficial: cualquier aviso de revisión previo debe retirarse allí después de publicar y verificar esta demo.

## Pruebas reproducibles

Con Node.js 20 o posterior, sin instalar paquetes:

```powershell
Set-Location "$HOME\Downloads\VYB_BODA_DEMO"
node .\tests\verify.mjs
node --check .\app.js
node --check .\config.js
```

Los casos configurados usan respuestas simuladas; nunca envían mensajes a una cuenta real. Ver los resultados y pendientes en CAMBIOS_Y_PRUEBAS.md.
