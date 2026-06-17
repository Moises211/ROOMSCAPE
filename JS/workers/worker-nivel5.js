//@ts-check
self.onmessage = function (event) {
    try {
        var datos = event.data;
        var total = datos.length;

        if (!datos || total === 0) {
            throw new Error("No se recibieron datos del Portal Cuántico.");
        }

        var sumTemp = 0, sumHum = 0, sumPres = 0;
        var validos = 0;

        var tempsValidas = [];
        var presionesValidas = [];

        var chunkSize = 10000; 

        for (let i = 0; i < total; i++) {
            var d = datos[i];
            
            if (d.temperatura >= 0 && d.humedad >= 0 && d.presion >= 0) {
                validos++;
                sumTemp += d.temperatura;
                sumHum += d.humedad;
                sumPres += d.presion;

                tempsValidas.push(d.temperatura);
                presionesValidas.push(d.presion);
            }

            if (i % chunkSize === 0 || i === total - 1) {
                var porcentaje = Math.round((i / total) * 100);
                self.postMessage({ status: 'progreso', porcentaje: porcentaje });
            }
        }
        
        var top10Temp = tempsValidas.sort((a, b) => b - a).slice(0, 10);
        var top10Pres = presionesValidas.sort((a, b) => b - a).slice(0, 10);

        self.postMessage({
            status: 'completado',
            resultados: {
                totalRegistros: total,
                registrosValidos: validos,
                promedioTemperatura: validos > 0 ? (sumTemp / validos).toFixed(2) : 0,
                promedioHumedad: validos > 0 ? (sumHum / validos).toFixed(2) : 0,
                promedioPresion: validos > 0 ? (sumPres / validos).toFixed(2) : 0,
                topTemperaturas: top10Temp,
                topPresiones: top10Pres
            }
        });

    } catch (error) {
        var message = error instanceof Error ? error.message : String(error);
        self.postMessage({ status: 'error', message: message });
    }
};