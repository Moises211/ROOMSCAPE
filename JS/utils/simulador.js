//@ts-check
class SimuladorSensores {
    /**
     * @param {number} cantidad 
     */
    static generarNivel4(cantidad = 20000) {
        const datos = [];
        for (let i = 0; i < cantidad; i++) {
            datos.push({
                temperatura: Math.random() * 60, 
                humedad: Math.random() * 100    
            });
        }
        return datos;
    }    
}