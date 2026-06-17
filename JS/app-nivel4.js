// js/main-nivel4.js
const btnNivel4 = document.getElementById('btnNivel4');
const barraN4 = document.getElementById('barraN4');
const resultadosN4 = document.getElementById('resultadosN4');

const workerN4 = new Worker('../JS/workers/worker-nivel4.js');

workerN4.onerror = function(error) {
    console.error("Error crítico en Worker 4:", error.message);
};

workerN4.onmessage = function(event) {
    const { status, porcentaje, resultados, message } = event.data;

    if (status === 'progreso') {
        barraN4.style.width = `${porcentaje}%`;
        barraN4.innerHTML = `${porcentaje}%`;
    }

    if (status === 'completado') {
        barraN4.style.width = '100%';
        barraN4.innerHTML = '100%';
        
        resultadosN4.innerHTML = `
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
        resultadosN4.classList.remove('d-none');
    }

    if (status === 'error') {
        resultadosN4.innerHTML = `<div class="card-body text-danger">Error: ${message}</div>`;
        resultadosN4.classList.remove('d-none');
    }
};

btnNivel4.addEventListener('click', () => {
    resultadosN4.classList.add('d-none');
    barraN4.style.width = '0%';
    barraN4.innerHTML = '0%';

    
    const datosSimulados = SimuladorSensores.generarNivel4(20000);
        
    workerN4.postMessage(datosSimulados);
});