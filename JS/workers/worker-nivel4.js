//@ts-check
self.onmessage = function (event) {
    try {
        var datos = event.data;
        var total = datos.length;

        if (!datos || total === 0) {
            throw new Error("No se recibieron datos válidos para procesar.");
        }

        var sumTemp = 0, sumHum = 0;
        var maxTemp = -Infinity, minTemp = Infinity;
        var maxHum = -Infinity, minHum = Infinity;
        
        var chunkSize = 1000; 
        for (let i = 0; i < total; i++) {
            var d = datos[i];

            sumTemp += d.temperatura;
            sumHum += d.humedad;

            if (d.temperatura > maxTemp) maxTemp = d.temperatura;
            if (d.temperatura < minTemp) minTemp = d.temperatura;
            if (d.humedad > maxHum) maxHum = d.humedad;
            if (d.humedad < minHum) minHum = d.humedad;
            
            if (i % chunkSize === 0 || i === total - 1) {
                var porcentaje = Math.round((i / total) * 100);
                self.postMessage({ status: 'progreso', porcentaje: porcentaje });
            }
        }

        
        self.postMessage({
            status: 'completado',
            resultados: {
                totalProcesados: total,
                promedioTemperatura: (sumTemp / total).toFixed(2),
                promedioHumedad: (sumHum / total).toFixed(2),
                maxTemperatura: maxTemp.toFixed(2),
                minTemperatura: minTemp.toFixed(2),
                maxHumedad: maxHum.toFixed(2),
                minHumedad: minHum.toFixed(2)
            }
        });

    } catch (error) {
        var message = error instanceof Error ? error.message : String(error);
        self.postMessage({ status: 'error', message: message });
    }
};