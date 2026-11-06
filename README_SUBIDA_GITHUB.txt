VYB / BODA-DEMO — Galería V2 (6 noviembre 2026)

PROBLEMA: la captura mostraba la distribución vieja de tres columnas.
CORRECCION: grilla fija de dos columnas en desktop, una en móvil, sin márgenes negativos, con fotografías y epígrafes alineados.
IMPORTANTE: index.html ahora apunta a styles.css?v=vyb-boda-gallery-20261106-v2 para evitar que el navegador siga usando el CSS viejo.

EN GITHUB (repositorio Boda-demo):
1. Reemplazar index.html y styles.css en la raíz, en el MISMO COMMIT.
2. NO borrar assets, config.js ni app.js.
3. Commit & Push en main.
4. Comprobar https://lucayuale.github.io/Boda-demo/ después de desplegar.
5. Si sigue igual, abrir F12 > Network y comprobar que styles.css?v=vyb-boda-gallery-20261106-v2 se descargue con estado 200.

Este ZIP parcial incluye solamente index.html y styles.css para minimizar modificaciones.
