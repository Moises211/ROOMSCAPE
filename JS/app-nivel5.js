// @ts-check
var btnNivel5 = document.getElementById('btnNivel5');
var btnExportar = document.getElementById('btnExportar');
var barraN5 = document.getElementById('barraN5');
var resultadosN5 = document.getElementById('resultadosN5');

var workerN5 = new Worker('../JS/workers/worker-nivel5.js');
/** @type {any} */
var datosJsonDescargable = null;

workerN5.onerror = function(error) {
    console.error("Error crítico en Worker 5:", error.message);
};

workerN5.onmessage = function(event) {
    var { status, porcentaje, resultados, message } = event.data;

    if (status === 'progreso' && barraN5) {
        barraN5.style.width = `${porcentaje}%`;
        barraN5.innerHTML = `${porcentaje}%`;
    }

    if (status === 'completado') {
        if (barraN5) {
            barraN5.style.width = '100%';
            barraN5.innerHTML = '100%';
        }
        
        datosJsonDescargable = resultados; 
        if (btnExportar) btnExportar.classList.remove('d-none');

        if (resultadosN5) resultadosN5.innerHTML = `
            <div class="card-body">
                <h5 class="card-title text-dark">Estadísticas del Portal Cuántico</h5>
                <hr>
                <p><strong>Total Registros Procesados:</strong> ${resultados.totalRegistros}</p>
                <p class="text-success"><strong>Registros Válidos (No Negativos):</strong> ${resultados.registrosValidos}</p>
                <p><strong>Promedio Temperatura:</strong> ${resultados.promedioTemperatura}°C</p>
                <p><strong>Promedio Humedad:</strong> ${resultados.promedioHumedad}%</p>
                <p><strong>Promedio Presión:</strong> ${resultados.promedioPresion} hPa</p>
                <hr>
                <h6>Top 10 Temperaturas Altas (°C):</h6>
                <p class="text-muted">${resultados.topTemperaturas.map((/** @type {number} */ n) => n.toFixed(2)).join(' | ')}</p>
                <h6>Top 10 Presiones Altas (hPa):</h6>
                <p class="text-muted">${resultados.topPresiones.map((/** @type {number} */ n) => n.toFixed(1)).join(' | ')}</p>
            </div>
        `;
        if (resultadosN5) resultadosN5.classList.remove('d-none');
    }

    if (status === 'error') {
        if (resultadosN5) resultadosN5.innerHTML = `<div class="card-body text-danger">Error: ${message}</div>`;
        if (resultadosN5) resultadosN5.classList.remove('d-none');
    }
};

if (btnNivel5) {
    btnNivel5.addEventListener('click', () => {
        if (resultadosN5) resultadosN5.classList.add('d-none');
        if (btnExportar) btnExportar.classList.add('d-none');
        if (barraN5) {
            barraN5.style.width = '0%';
            barraN5.innerHTML = '0%';
        }

        var datosSimulados = SimuladorSensores.generarNivel5(250000);
        workerN5.postMessage(datosSimulados);
    });
}

if (btnExportar) {
    btnExportar.addEventListener('click', () => {
        if (!datosJsonDescargable) return;
        
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datosJsonDescargable, null, 2));
        var downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "portal_cuantico_stats.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });
}