// @ts-check
(function () {
    'use strict';

    var canvas = /** @type {HTMLCanvasElement|null} */ (document.getElementById('mapaCanvas'));
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var btnDibujar = /** @type {HTMLButtonElement|null} */ (document.getElementById('btnDibujarMapa'));
    var btnMarcar = /** @type {HTMLButtonElement|null} */ (document.getElementById('btnMarcarPosicion'));
    var btnReiniciar = /** @type {HTMLButtonElement|null} */ (document.getElementById('btnReiniciar'));
    var btnContinuar = /** @type {HTMLButtonElement|null} */ (document.getElementById('btnContinuar'));
    var estadoLienzo = document.getElementById('estadoLienzo');
    var mensajeProgreso = document.getElementById('mensajeProgreso');
    var alertaUbicacion = document.getElementById('alertaUbicacion');

    var mapaDibujado = false;
    var posicionMarcada = false;
    var ubicacion = obtenerUbicacionNivel1();

    mostrarCoordenadas();
    limpiarLienzo();
    actualizarInterfaz();

    if (btnDibujar) btnDibujar.addEventListener('click', dibujarMapa);
    if (btnMarcar) btnMarcar.addEventListener('click', marcarPosicion);
    if (btnReiniciar) btnReiniciar.addEventListener('click', reiniciarNivel);
    if (btnContinuar) btnContinuar.addEventListener('click', completarNivel);
    window.addEventListener('resize', redibujar);

    /** Recupera coordenadas guardadas por el nivel 1 usando formatos comunes. */
    function obtenerUbicacionNivel1() {
        var claves = ['roomscape_nivel1', 'ubicacionNivel1', 'ubicacion', 'geolocalizacion'];

        for (var i = 0; i < claves.length; i++) {
            try {
                var contenido = localStorage.getItem(claves[i]);
                if (!contenido) continue;
                var datos = JSON.parse(contenido);
                var normalizada = normalizarCoordenadas(datos);
                if (normalizada) return normalizada;
            } catch (error) {
                console.warn('No se pudo leer la clave ' + claves[i] + '.', error);
            }
        }

        var latitudGuardada = localStorage.getItem('latitud');
        var longitudGuardada = localStorage.getItem('longitud');
        var latitud = latitudGuardada === null ? NaN : Number(latitudGuardada);
        var longitud = longitudGuardada === null ? NaN : Number(longitudGuardada);
        if (coordenadasValidas(latitud, longitud)) return { latitud: latitud, longitud: longitud };

        var parametros = new URLSearchParams(window.location.search);
        var latitudParametro = parametros.get('lat');
        var longitudParametro = parametros.get('lng');
        latitud = latitudParametro === null ? NaN : Number(latitudParametro);
        longitud = longitudParametro === null ? NaN : Number(longitudParametro);
        return coordenadasValidas(latitud, longitud) ? { latitud: latitud, longitud: longitud } : null;
    }

    function normalizarCoordenadas(datos) {
        if (!datos || typeof datos !== 'object') return null;
        var latitud = Number(datos.latitud ?? datos.latitude ?? datos.lat);
        var longitud = Number(datos.longitud ?? datos.longitude ?? datos.lng ?? datos.lon);
        return coordenadasValidas(latitud, longitud) ? { latitud: latitud, longitud: longitud } : null;
    }

    function coordenadasValidas(latitud, longitud) {
        return Number.isFinite(latitud) && Number.isFinite(longitud) &&
            latitud >= -90 && latitud <= 90 && longitud >= -180 && longitud <= 180;
    }

    function mostrarCoordenadas() {
        var latitudEl = document.getElementById('valorLatitud');
        var longitudEl = document.getElementById('valorLongitud');

        if (ubicacion) {
            if (latitudEl) latitudEl.textContent = ubicacion.latitud.toFixed(6) + '°';
            if (longitudEl) longitudEl.textContent = ubicacion.longitud.toFixed(6) + '°';
            return;
        }

        if (alertaUbicacion) {
            alertaUbicacion.classList.remove('d-none');
            alertaUbicacion.innerHTML = '<strong>Ubicación pendiente.</strong> Completa el nivel 1 para recuperar las coordenadas y poder marcar tu posición.';
        }
    }

    function limpiarLienzo() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var fondo = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        fondo.addColorStop(0, '#132d33');
        fondo.addColorStop(1, '#091a20');
        ctx.fillStyle = fondo;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(255,255,255,.045)';
        ctx.lineWidth = 1;
        for (var x = 0; x < canvas.width; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (var y = 0; y < canvas.height; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
    }

    function dibujarMapa() {
        if (!ctx) return;
        limpiarLienzo();

        // Rectángulos: zonas y edificios del mapa simplificado.
        ctx.fillStyle = '#1c4a50';
        ctx.strokeStyle = '#5ea8a8';
        ctx.lineWidth = 3;
        [[70, 70, 190, 115], [635, 65, 195, 130], [80, 355, 210, 130], [620, 350, 205, 125]].forEach(function (r) {
            ctx.fillRect(r[0], r[1], r[2], r[3]);
            ctx.strokeRect(r[0], r[1], r[2], r[3]);
        });

        // Líneas: vías principales y secundarias.
        ctx.strokeStyle = '#d6bd78';
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(40, 280); ctx.lineTo(860, 280);
        ctx.moveTo(450, 35); ctx.lineTo(450, 525);
        ctx.stroke();
        ctx.strokeStyle = '#fff3c4';
        ctx.lineWidth = 2;
        ctx.setLineDash([16, 13]);
        ctx.beginPath();
        ctx.moveTo(40, 280); ctx.lineTo(860, 280);
        ctx.moveTo(450, 35); ctx.lineTo(450, 525);
        ctx.stroke();
        ctx.setLineDash([]);

        // Círculo: plaza central.
        ctx.beginPath();
        ctx.arc(450, 280, 72, 0, Math.PI * 2);
        ctx.fillStyle = '#2d786b';
        ctx.fill();
        ctx.strokeStyle = '#8dd5b6';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(450, 280, 35, 0, Math.PI * 2);
        ctx.fillStyle = '#74b98e';
        ctx.fill();

        escribirEtiqueta('ARCHIVO NORTE', 95, 130);
        escribirEtiqueta('TORRE DE DATOS', 670, 130);
        escribirEtiqueta('DISTRITO ENERGÍA', 100, 420);
        escribirEtiqueta('CENTRO DE CONTROL', 645, 415);
        escribirEtiqueta('PLAZA CENTRAL', 390, 385);

        mapaDibujado = true;
        posicionMarcada = false;
        actualizarInterfaz();
    }

    function escribirEtiqueta(texto, x, y) {
        if (!ctx) return;
        ctx.fillStyle = '#dff4ef';
        ctx.font = '600 16px system-ui, sans-serif';
        ctx.fillText(texto, x, y);
    }

    function marcarPosicion() {
        if (!ctx || !mapaDibujado || !ubicacion) return;

        var x = 65 + ((ubicacion.longitud + 180) / 360) * (canvas.width - 130);
        var y = 55 + ((90 - ubicacion.latitud) / 180) * (canvas.height - 110);

        ctx.save();
        ctx.shadowColor = '#ffca3a';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffca3a';
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#fff8dc';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 23, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#07191d';
        ctx.fillRect(Math.min(x + 30, canvas.width - 185), Math.max(y - 27, 10), 155, 36);
        ctx.fillStyle = '#ffdf78';
        ctx.font = '700 15px system-ui, sans-serif';
        ctx.fillText('TU POSICIÓN', Math.min(x + 43, canvas.width - 172), Math.max(y - 3, 34));

        posicionMarcada = true;
        actualizarInterfaz();
    }

    function actualizarInterfaz() {
        marcarCheck('checkMapa', mapaDibujado);
        marcarCheck('checkFiguras', mapaDibujado);
        marcarCheck('checkPosicion', posicionMarcada);

        if (btnMarcar) btnMarcar.disabled = !mapaDibujado || !ubicacion || posicionMarcada;
        if (btnContinuar) btnContinuar.disabled = !mapaDibujado || !posicionMarcada;

        if (estadoLienzo) {
            estadoLienzo.className = 'badge ' + (posicionMarcada ? 'text-bg-success' : mapaDibujado ? 'text-bg-warning' : 'text-bg-secondary');
            estadoLienzo.textContent = posicionMarcada ? 'Mapa completado' : mapaDibujado ? 'Mapa dibujado' : 'Lienzo pendiente';
        }

        if (mensajeProgreso) {
            mensajeProgreso.textContent = posicionMarcada
                ? 'Todo listo. Ya puedes completar el nivel.'
                : mapaDibujado
                    ? (ubicacion ? 'Ahora marca tu posición en el mapa.' : 'Necesitas las coordenadas del nivel 1 para continuar.')
                    : 'Dibuja el mapa para comenzar.';
        }
    }

    function marcarCheck(id, completado) {
        var elemento = document.getElementById(id);
        if (!elemento) return;
        elemento.classList.toggle('completado', completado);
        var icono = elemento.querySelector('span');
        if (icono) icono.textContent = completado ? '✓' : '○';
    }

    function reiniciarNivel() {
        mapaDibujado = false;
        posicionMarcada = false;
        limpiarLienzo();
        actualizarInterfaz();
    }

    function completarNivel() {
        if (!mapaDibujado || !posicionMarcada) return;
        localStorage.setItem('roomscape_nivel2', JSON.stringify({
            completado: true,
            mapaDibujado: true,
            posicionMarcada: true,
            completadoEn: new Date().toISOString()
        }));

        if (btnContinuar) {
            btnContinuar.textContent = '✓ Nivel 2 completado';
            btnContinuar.disabled = true;
        }
        if (mensajeProgreso) mensajeProgreso.textContent = 'Acceso al nivel 3 desbloqueado.';
        window.setTimeout(function () {
            window.location.href = 'nivel3.html';
        }, 900);
    }

    function redibujar() {
        // Canvas conserva su resolución interna; CSS se encarga del ajuste responsivo.
        canvas.setAttribute('aria-description', mapaDibujado ? 'Mapa simplificado dibujado' : 'Lienzo cartográfico vacío');
    }
})();
