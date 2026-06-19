# ROOMSCAPE

> **La cámara de los cinco desafíos** — Escape room web desarrollado con JavaScript para recuperar el acceso a la base de datos de una ciudad inteligente.

ROOMSCAPE es una aplicación web interactiva en la que el jugador debe superar cinco niveles consecutivos. Cada desafío pone en práctica una API o capacidad distinta del navegador: geolocalización, Canvas, cámara, almacenamiento local y procesamiento en segundo plano mediante Web Workers.

## Colaboradores

- AA20029 — Moises A. Alvarenga A.
- TV22002 — Marvin A. Torres V.
- SG23001 — Luis E. Salamanca G.
- BM16036 — Erick Alexander Borja Mauricio

## Los cinco desafíos

| Nivel | Desafío | Tecnología principal | Estado en el repositorio |
| :---: | --- | --- | :---: |
| 1 | El Guardián de la Ubicación | Geolocation API | Implementado |
| 2 | El Cartógrafo Perdido | Canvas API y LocalStorage | Implementado |
| 3 | La Evidencia del Explorador | MediaDevices, cámara y LocalStorage | Implementado |
| 4 | El Núcleo de Procesamiento | Web Workers | Implementado |
| 5 | El Portal Cuántico | Web Workers y exportación JSON | Implementado |

### 1. El Guardián de la Ubicación

El jugador debe autorizar el acceso a su ubicación actual. La aplicación obtiene y muestra la latitud y longitud, además de controlar casos como permisos denegados o ubicación no disponible. Las coordenadas recuperadas se utilizan en el siguiente desafío.

### 2. El Cartógrafo Perdido

Con las coordenadas del nivel anterior se reconstruye un mapa simplificado mediante Canvas. El jugador debe dibujar elementos cartográficos básicos  y marcar su posición antes de poder avanzar.

### 3. La Evidencia del Explorador

El navegador solicita acceso a la cámara y muestra video en tiempo real. El jugador debe capturar al menos una fotografía, visualizarla y conservarla en `localStorage`. 
### 4. El Núcleo de Procesamiento

La aplicación genera 20,000 lecturas simuladas de temperatura y humedad. Un Web Worker calcula promedios, máximos y mínimos sin bloquear la interfaz, mientras una barra informa el progreso del procesamiento.

### 5. El Portal Cuántico

El desafío final procesa 250,000 registros simulados de temperatura, humedad y presión. El Worker descarta valores negativos, calcula estadísticas generales y obtiene los diez valores más altos de temperatura y presión. Los resultados pueden visualizarse y descargarse como un archivo JSON.

## Tecnologías

- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- Canvas API
- Geolocation API
- MediaDevices API
- Web Workers
- LocalStorage

## Estructura principal

```text
ROOMSCAPE/
├── CSS/
│   └── Style.css
├── HTML/
│   ├── nivel1.html
│   ├── nivel2.html
│   ├── nivel3.html
│   ├── nivel4.html
│   └── nivel5.html
├── JS/
│   ├── app-nivel1.js
│   ├── app-nivel2.js
│   ├── app-nivel3.js
│   ├── app-nivel4.js
│   ├── app-nivel5.js
│   ├── utils/
│   └── workers/
├── Index.html
└── README.md
```
