# Aula Virtual · HU-04 y HU-10 (User persona: Daniela Torres)

Prototipo frontend del TB2 · Diseño y Tecnologías UX (1FIS0282).
Tecnologías: **HTML5, CSS3 y JavaScript (sin frameworks)**.

## Cómo ejecutarlo
Abre `index.html` en el navegador. No necesita instalación ni servidor.

## Estructura
```
index.html            Portada con acceso a cada historia
css/estilos.css       Estilos compartidos (tokens del Figma: colores, radios, tipografía Inter)
js/datos.js           Fuente única de datos de Daniela (cursos, evaluaciones, fechas)
js/app.js             Lógica: sidebar, cálculos de promedios, pestañas, recordatorios
hu04/                 Login → Microsoft → Actividades por realizar
hu10/                 Login → Microsoft → Inicio → Calificaciones → Detalle del curso
img/                  Logos (provisionales: reemplazar por los exportados desde Figma)
```

## Decisiones de diseño
- **Una sola fuente de datos** (`datos.js`): la HU-04 y la HU-10 siempre muestran la misma información.
- **Los promedios se calculan**, no se escriben a mano: promedio ponderado solo de lo calificado.
- **Fecha de referencia fija** (`FECHA_HOY` = 05/10/2026 15:00) para que la demo sea reproducible.
- **Responsive**: bajo 768 px el sidebar se reemplaza por una barra de navegación inferior (versión móvil de la HU-04).
- **Recordatorios configurables**: el botón "Configurar" abre un diálogo y recalcula los avisos de cada actividad.
