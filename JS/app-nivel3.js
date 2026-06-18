const video = document.getElementById("video");
const canvas = document.getElementById("canvasCaptura");
const fotoCapturada = document.getElementById("fotoCapturada");
const placeholderFoto = document.getElementById("placeholderFoto");

const btnActivarCamara = document.getElementById("btnActivarCamara");
const btnCapturar = document.getElementById("btnCapturar");
const btnCompletar = document.getElementById("btnCompletar");

const estadoCamara = document.getElementById("estadoCamara");

const alertaNivel = document.getElementById("alertaNivel");
const alertaCamara = document.getElementById("alertaCamara");

const mensajeProgreso = document.getElementById("mensajeProgreso");

const checkCamara = document.getElementById("checkCamara");
const checkFoto = document.getElementById("checkFoto");
const checkGuardado = document.getElementById("checkGuardado");

let streamCamara = null;

let camaraActiva = false;
let fotoTomada = false;
let fotoGuardada = false;

/* =====================================================
   VALIDAR NIVEL 2
===================================================== */

function validarNivel2() {

    const nivel2 = localStorage.getItem("roomscape_nivel2");

    if (!nivel2) {

        alertaNivel.classList.remove("d-none");

        alertaNivel.innerHTML =
            "<strong>Acceso bloqueado:</strong> Debes completar el Nivel 2 antes de acceder al Nivel 3.";

        btnActivarCamara.disabled = true;

        return false;
    }

    return true;
}

/* =====================================================
   CHECKLIST
===================================================== */

function marcarCheck(elemento) {

    elemento.classList.add("completado");

    elemento.querySelector("span").textContent = "✓";
}

function verificarNivelCompleto() {

    if (
        camaraActiva &&
        fotoTomada &&
        fotoGuardada
    ) {

        btnCompletar.disabled = false;

        mensajeProgreso.textContent =
            "Nivel completado. Puedes continuar.";
    }
}

/* =====================================================
   ACTIVAR CÁMARA
===================================================== */

async function iniciarCamara() {

    try {

        streamCamara =
            await navigator.mediaDevices.getUserMedia({
                video: true
            });

        video.srcObject = streamCamara;

        camaraActiva = true;

        marcarCheck(checkCamara);

        /* CORRECCIÓN DEL BUG */
        verificarNivelCompleto();

        btnCapturar.disabled = false;

        estadoCamara.textContent =
            "Cámara activa";

        estadoCamara.classList.remove(
            "text-bg-secondary"
        );

        estadoCamara.classList.add(
            "text-bg-success"
        );

        mensajeProgreso.textContent =
            "Captura una fotografía.";

        alertaCamara.classList.add("d-none");

    }
    catch (error) {

        console.log(error);
        console.log(error.name);

        alertaCamara.classList.remove("d-none");

        if (error.name === "NotAllowedError") {

            alertaCamara.textContent =
                "Permiso para acceder a la cámara denegado.";

        }
        else if (error.name === "NotFoundError") {

            alertaCamara.textContent =
                "No se encontró una cámara disponible.";

        }
        else if (error.name === "NotReadableError") {

            alertaCamara.textContent =
                "La cámara no está disponible o no puede utilizarse actualmente.";

        }
        else {

            alertaCamara.textContent =
                `Error de cámara: ${error.name}`;

        }
    }
}

/* =====================================================
   CAPTURAR FOTO
===================================================== */

function capturarFoto() {

    const contexto = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    contexto.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const imagenBase64 =
        canvas.toDataURL("image/png");

    fotoCapturada.src = imagenBase64;

    fotoCapturada.classList.remove("d-none");

    placeholderFoto.classList.add("d-none");

    fotoTomada = true;

    marcarCheck(checkFoto);

    localStorage.setItem(
        "roomscape_nivel3_foto",
        imagenBase64
    );

    localStorage.setItem(
        "roomscape_nivel3",
        JSON.stringify({
            completado: true,
            fecha: new Date().toISOString()
        })
    );

    fotoGuardada = true;

    marcarCheck(checkGuardado);

    mensajeProgreso.textContent =
        "Fotografía almacenada correctamente.";

    verificarNivelCompleto();
}

/* =====================================================
   FOTO PREVIA
===================================================== */

function cargarFotoGuardada() {

    const foto =
        localStorage.getItem(
            "roomscape_nivel3_foto"
        );

    if (!foto) return;

    fotoCapturada.src = foto;

    fotoCapturada.classList.remove("d-none");

    placeholderFoto.classList.add("d-none");

    fotoTomada = true;
    fotoGuardada = true;

    marcarCheck(checkFoto);
    marcarCheck(checkGuardado);

    verificarNivelCompleto();
}

/* =====================================================
   EVENTOS
===================================================== */

btnActivarCamara.addEventListener(
    "click",
    iniciarCamara
);

btnCapturar.addEventListener(
    "click",
    capturarFoto
);

btnCompletar.addEventListener(
    "click",
    () => {

        if (streamCamara) {
            streamCamara
                .getTracks()
                .forEach(track => track.stop());
        }

        window.location.href = "nivel4.html";
    }
);

/* =====================================================
   INICIO
===================================================== */

if (validarNivel2()) {

    cargarFotoGuardada();
}