//@ts-check
var btnNivel4 = document.getElementById('btnNivel4');
var btnContinuar = document.getElementById('btnContinuar');
var barraN4 = document.getElementById('barraN4');
var resultadosN4 = document.getElementById('resultadosN4');

var workerN4 = new Worker('JS/workers/worker-nivel4.js');

workerN4.onerror = function(error) {
    console.error("Error crítico en Worker 4:", error.message);
};

workerN4.onmessage = function(event) {
    var { status, porcentaje, resultados, message } = event.data;

    if (status === 'progreso' && barraN4) {
        barraN4.style.width = `${porcentaje}%`;
        barraN4.innerHTML = `${porcentaje}%`;
    }

    if (status === 'completado' && barraN4) {
        barraN4.style.width = '100%';
        barraN4.innerHTML = '100%';
        
        if (resultadosN4) resultadosN4.innerHTML = `
            <div class="card-body">
                <h5 class="card-title text-primary">Estadísticas del Núcleo</h5>
                <hr>
                <p><strong>Registros Procesados:</strong> ${resultados.totalProcesados}</p>
                <p><strong>Promedio Temperatura:</strong> ${resultados.promedioTemperatura}°C</p>
                <p><strong>Promedio Humedad:</strong> ${resultados.promedioHumedad}%</p>
                <p><strong>Temperatura:</strong> Max ${resultados.maxTemperatura}°C / Mín ${resultados.minTemperatura}°C</p>
                <p class="mb-0"><strong>Humedad:</strong> Max ${resultados.maxHumedad}% / Mín ${resultados.minHumedad}%</p>
            </div>
        `;
        if (resultadosN4) resultadosN4.classList.remove('d-none');
        if (btnContinuar) btnContinuar.disabled = false;
    }
};

if (btnNivel4) {
    btnNivel4.addEventListener('click', () => {
        if (resultadosN4) resultadosN4.classList.add('d-none');
        if (barraN4) {
            barraN4.style.width = '0%';
            barraN4.innerHTML = '0%';
        }
        if (btnContinuar) btnContinuar.disabled = true;

        const datosSimulados = SimuladorSensores.generarNivel4(20000);
        workerN4.postMessage(datosSimulados);
    });
}

if (btnContinuar) {
    btnContinuar.addEventListener('click', () => {
        if (window.AppNavigation && typeof window.AppNavigation.navigate === 'function') {
            window.AppNavigation.navigate('nivel5');
        } else {
            window.location.href = 'nivel5.html';
        }
    });
}
