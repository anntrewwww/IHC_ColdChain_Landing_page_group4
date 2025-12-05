/* =========================================================
   SCRIPT2.JS - LÓGICA DE CONTACTO Y ATENCIÓN AL CLIENTE
   ========================================================= */

/* --- 1. VALIDACIÓN Y ENVÍO DE SOLICITUD --- */
function validarYEnviarSolicitud(event) {
  event.preventDefault(); // Evita recarga

  // Obtener campos
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const org = document.getElementById("organizacion");
  const nec = document.getElementById("necesidad");

  // Estado de validación
  let esValido = true;

  // Función auxiliar para validar
  function validarCampo(input, idError) {
    const errorElem = document.getElementById(idError);
    if (input.value.trim() === "") {
      input.classList.add("input-error");
      if (errorElem) errorElem.style.display = "block";
      return false;
    } else {
      input.classList.remove("input-error");
      if (errorElem) errorElem.style.display = "none";
      return true;
    }
  }

  // Validar cada uno
  if (!validarCampo(nombre, "error-nombre")) esValido = false;
  if (!validarCampo(email, "error-email")) esValido = false;
  if (!validarCampo(org, "error-org")) esValido = false;
  if (!validarCampo(nec, "error-nec")) esValido = false;

  if (esValido) {
    mostrarModalExitoSolicitud();
    document.getElementById("form-solicitud").reset();
  }
}

function mostrarModalExitoSolicitud() {
  const modal = document.getElementById("modal-solicitud-exito");
  if (modal) {
    modal.style.display = "flex";
    setTimeout(() => {
      modal.style.display = "none";
    }, 1500);
  }
}

/* --- 2. LÓGICA ATENCIÓN AL CLIENTE (LLAMADAS) --- */

function abrirAtencionCliente() {
  // 1. Intentar obtener el usuario logueado del LocalStorage
  const sessionKey = "coldchain_session"; // La misma clave que usas en auth.js
  const sesionActiva = JSON.parse(localStorage.getItem(sessionKey));

  // 2. Obtener referencias a los inputs del modal
  const inputUsuarioModal = document.getElementById("atencion-usuario");
  const inputCorreoModal = document.getElementById("atencion-correo");

  if (sesionActiva) {
    // CASO A: Hay un usuario logueado -> Usar sus datos
    if (inputUsuarioModal) inputUsuarioModal.value = sesionActiva.usuario;
    if (inputCorreoModal) inputCorreoModal.value = sesionActiva.email;
  } else {
    // CASO B: No hay sesión -> Intentar usar lo que escribió en el formulario de contacto o poner "Invitado"
    const nombreForm = document.getElementById("nombre").value;
    const emailForm = document.getElementById("email").value;

    if (inputUsuarioModal)
      inputUsuarioModal.value = nombreForm || "Usuario Invitado";
    if (inputCorreoModal)
      inputCorreoModal.value = emailForm || "Sin correo especificado";
  }

  // 3. Mostrar el modal
  const modal = document.getElementById("modal-atencion");
  if (modal) {
    modal.style.display = "flex";
  }
}

function cerrarAtencion() {
  const modal = document.getElementById("modal-atencion");
  if (modal) modal.style.display = "none";
}

function enviarEmergencia(event) {
  event.preventDefault();

  // Validar que haya escrito la emergencia
  const msg = document.getElementById("atencion-msg").value;
  if (msg.trim() === "") {
    alert("Por favor describe la emergencia.");
    return;
  }

  // 1. Cerrar modal de atención
  cerrarAtencion();

  // 2. Mostrar modal de Éxito
  const modalExito = document.getElementById("modal-emergencia-exito");
  if (modalExito) modalExito.style.display = "flex";

  // Limpiar el campo de emergencia para la próxima
  document.getElementById("atencion-msg").value = "";
}

function cerrarEmergenciaExito() {
  const modal = document.getElementById("modal-emergencia-exito");
  if (modal) modal.style.display = "none";
}

/* ---------------------------------------------------------
   3. LÓGICA DE MODALES DE PRECIOS (PAGO Y VENTAS)
   --------------------------------------------------------- */

function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) modal.style.display = "none";
}

// --- PAGO (PLAN EMPRESARIAL) ---
function abrirModalPago() {
  // Verificar si hay sesión antes de pagar (Opcional, pero recomendado)
  const sesion = localStorage.getItem("coldchain_session");
  if (!sesion) {
    alert("Por favor, inicia sesión o regístrate antes de comprar.");
    window.location.href = "registro.html";
    return;
  }

  const modal = document.getElementById("modal-pago");
  if (modal) modal.style.display = "flex";
}

function procesarPago(event) {
  event.preventDefault();
  cerrarModal("modal-pago");

  const modalExito = document.getElementById("modal-pago-exito");
  if (modalExito) {
    modalExito.style.display = "flex";
    setTimeout(() => {
      // Redirigir al monitor después del pago
      window.location.href = "monitoreo.html";
    }, 2000);
  }
}

// --- VENTAS (PLAN CORPORATIVO) ---
function abrirModalVentas() {
  const modal = document.getElementById("modal-ventas");
  if (modal) modal.style.display = "flex";
}

function enviarCorreoVentas(event) {
  event.preventDefault();
  cerrarModal("modal-ventas");

  const modalExito = document.getElementById("modal-ventas-exito");
  if (modalExito) {
    modalExito.style.display = "flex";
    setTimeout(() => {
      modalExito.style.display = "none";
    }, 2500);
  }
}
