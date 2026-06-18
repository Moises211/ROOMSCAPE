# ROOMSCAPE

> **La cámara de los cinco desafíos** — Escape room web desarrollado con JavaScript para recuperar el acceso a la base de datos de una ciudad inteligente.

ROOMSCAPE es una aplicación web interactiva en la que el jugador debe superar cinco niveles consecutivos. Cada desafío pone en práctica una API o capacidad distinta del navegador: geolocalización, Canvas, cámara, almacenamiento local y procesamiento en segundo plano mediante Web Workers.

## Objetivo

La humanidad perdió el acceso a información crítica para el funcionamiento de una ciudad inteligente. Para restaurarlo, el jugador debe completar cada prueba en orden; un nivel solo se desbloquea cuando se cumplen todas sus condiciones.

## Los cinco desafíos

| Nivel | Desafío | Tecnología principal | Estado en el repositorio |
| :---: | --- | --- | :---: |
| 1 | El Guardián de la Ubicación | Geolocation API | Pendiente de integración |
| 2 | El Cartógrafo Perdido | Canvas API y LocalStorage | Implementado |
| 3 | La Evidencia del Explorador | MediaDevices, cámara y LocalStorage | Pendiente de integración |
| 4 | El Núcleo de Procesamiento | Web Workers | Implementado |
| 5 | El Portal Cuántico | Web Workers y exportación JSON | Implementado |

### Nivel 2: El Cartógrafo Perdido

El nivel 2 recupera las coordenadas obtenidas en el nivel anterior y permite:

- Dibujar un mapa simplificado sobre un elemento `<canvas>`.
- Representar círculos, líneas y rectángulos.
- Marcar visualmente la posición del jugador.
- Validar que el mapa y el marcador existan antes de completar el nivel.
- Guardar el progreso en `localStorage` para desbloquear el siguiente desafío.

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

El proyecto no utiliza frameworks de JavaScript, backend, base de datos ni librerías externas de mapas o Canvas.

## Cómo ejecutar el proyecto

Por utilizar APIs del navegador y archivos JavaScript separados, se recomienda servir el proyecto desde un servidor local en lugar de abrir los HTML directamente.

Con la extensión **Live Server** de Visual Studio Code:

1. Abre la carpeta del proyecto en Visual Studio Code.
2. Haz clic derecho sobre el archivo HTML del nivel que deseas probar.
3. Selecciona **Open with Live Server**.

También puedes utilizar Python desde la raíz del proyecto:

```bash
python -m http.server 8000
```

Después abre el nivel deseado, por ejemplo `http://localhost:8000/HTML/nivel2.html`.

## Probar el nivel 2 de forma independiente

El flujo normal espera que el nivel 1 guarde la ubicación. Para probar el nivel 2 mientras se completa la integración, utiliza coordenadas de prueba en la URL:

```text
http://localhost:8000/HTML/nivel2.html?lat=13.692940&lng=-89.218190
```

Luego:

1. Selecciona **Dibujar mapa**.
2. Selecciona **Marcar mi posición**.
3. Verifica la lista de requisitos.
4. Selecciona **Completar nivel 2**.

## Estructura principal

```text
ROOMSCAPE/
├── CSS/
│   └── Style.css
├── HTML/
│   ├── nivel2.html
│   ├── nivel4.html
│   └── nivel5.html
├── JS/
│   ├── app-nivel2.js
│   ├── app-nivel4.js
│   ├── app-nivel5.js
│   ├── utils/
│   └── workers/
├── Index.html
└── README.md
```

## Contexto académico

Proyecto grupal desarrollado para la asignatura **Desarrollo y Técnicas de Aplicaciones Web (DTW135)**, Ciclo I 2026, de la Universidad de El Salvador, Facultad Multidisciplinaria de Occidente.

## Contribuciones

Cada integrante desarrolla su nivel en una rama independiente. Las contribuciones se incorporan a `main` mediante Pull Requests para facilitar la revisión y mantener estable la versión principal.
