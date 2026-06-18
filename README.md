# ROOMSCAPE

> **La cámara de los cinco desafíos** — Escape room web desarrollado con JavaScript para recuperar el acceso a la base de datos de una ciudad inteligente.

ROOMSCAPE es una aplicación web interactiva en la que el jugador debe superar cinco niveles consecutivos. Cada desafío pone en práctica una API o capacidad distinta del navegador: geolocalización, Canvas, cámara, almacenamiento local y procesamiento en segundo plano mediante Web Workers.

## Objetivo

La humanidad perdió el acceso a información crítica para el funcionamiento de una ciudad inteligente. Para restaurarlo, el jugador debe completar cada prueba en orden; un nivel solo se desbloquea cuando se cumplen todas sus condiciones.

## ¿Cómo funciona?

El recorrido está formado por cinco niveles conectados. Cada uno utiliza información o progreso del nivel anterior y valida sus propios requisitos antes de permitir que el jugador continúe. El navegador conserva los avances necesarios mediante `localStorage`, mientras que las tareas de procesamiento intensivo se ejecutan en Web Workers para mantener la interfaz interactiva.

## Los cinco desafíos

| Nivel | Desafío | Tecnología principal | Estado en el repositorio |
| :---: | --- | --- | :---: |
| 1 | El Guardián de la Ubicación | Geolocation API | Pendiente de integración |
| 2 | El Cartógrafo Perdido | Canvas API y LocalStorage | Implementado |
| 3 | La Evidencia del Explorador | MediaDevices, cámara y LocalStorage | Pendiente de integración |
| 4 | El Núcleo de Procesamiento | Web Workers | Implementado |
| 5 | El Portal Cuántico | Web Workers y exportación JSON | Implementado |

### 1. El Guardián de la Ubicación

El jugador debe autorizar el acceso a su ubicación actual. La aplicación obtiene y muestra la latitud y longitud, además de controlar casos como permisos denegados o ubicación no disponible. Las coordenadas recuperadas se utilizan en el siguiente desafío.

### 2. El Cartógrafo Perdido

Con las coordenadas del nivel anterior se reconstruye un mapa simplificado mediante Canvas. El jugador debe dibujar elementos cartográficos básicos —círculos, líneas y rectángulos— y marcar su posición antes de poder avanzar.

### 3. La Evidencia del Explorador

El navegador solicita acceso a la cámara y muestra video en tiempo real. El jugador debe capturar al menos una fotografía, visualizarla y conservarla en `localStorage`. También se manejan errores de permisos o ausencia de cámara.

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

Después abre `http://localhost:8000` en el navegador. Durante el desarrollo también es posible acceder directamente a los archivos dentro de `HTML/` para revisar cada desafío por separado.

## Criterios de finalización

Un nivel se considera completado únicamente cuando el jugador satisface todos sus requisitos. La aplicación debe impedir el acceso anticipado a desafíos superiores y conservar disponibles todos los niveles para su revisión. Durante el trabajo de los Web Workers, la interfaz debe continuar respondiendo a las interacciones del usuario.

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
