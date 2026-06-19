(function () {
    function inicializarNivel1() {
        const boton = document.getElementById("btnUbicacion");
        const siguiente = document.getElementById("btnSiguiente");

        if (!boton || !siguiente) {
            window.setTimeout(inicializarNivel1, 20);
            return;
        }

        boton.addEventListener("click", obtenerUbicacion);
        siguiente.addEventListener("click", () => {
            if (window.AppNavigation && typeof window.AppNavigation.navigate === 'function') {
                window.AppNavigation.navigate('nivel2');
            } else {
                window.location.href = 'nivel2.html';
            }
        });
    }

    inicializarNivel1();

    function obtenerUbicacion(){
        if(!navigator.geolocation){
            mostrarMensaje( "Tu navegador no soporta geolocalización", "danger" );
            return;
        }
        navigator.geolocation.getCurrentPosition( ubicacionCorrecta, errorUbicacion );
    }


function ubicacionCorrecta(posicion){
    let lat = posicion.coords.latitude;
    let lon = posicion.coords.longitude;
    document.getElementById( "latitud" ).innerHTML=lat;
    document.getElementById( "longitud" ).innerHTML=lon;
    mostrarMensaje( "Ubicación obtenida correctamente", "success" );
    localStorage.setItem( "nivel1", "completo" );

    //Guardar latitud y longitud en localStorage para nivel 2 
    localStorage.setItem("latitud" , lat);
    localStorage.setItem("longitud" , lon);

    const siguiente = document.getElementById("btnSiguiente");
    if (siguiente) {
        siguiente.disabled = false;
    }
}


function errorUbicacion(error){

    switch(error.code){
    case error.PERMISSION_DENIED:
    mostrarMensaje( "Permiso de ubicación denegado", "danger" );
    break;
    case error.POSITION_UNAVAILABLE:
    mostrarMensaje( "Ubicación no disponible", "warning" );
    break;
    default:
    mostrarMensaje( "Error obteniendo ubicación", "danger" );
    }

}


function mostrarMensaje(texto,tipo){
    let mensaje = document.getElementById( "mensaje" );
    if (!mensaje) return;
    mensaje.className= "alert alert-"+tipo;
    mensaje.innerHTML=texto;
}
})();