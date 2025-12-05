/* ==========================================================================
   PERFIL.JS - GESTIÓN DE DATOS, EDICIÓN Y BORRADO (SIN ALERTS NATIVOS)
   ========================================================================== */

const SESSION_KEY = "coldchain_session";
const DB_EQUIPOS_KEY = "coldchain_equipos";
const DB_REPORTES_KEY = "coldchain_reportes";

document.addEventListener("DOMContentLoaded", function () {
  cargarDatosUsuario();
});

/* --- UTILIDADES DE MODALES --- */
function mostrarAlerta(mensaje) {
  const modal = document.getElementById("modal-mensaje-generico");
  if (!modal) {
    alert(mensaje);
    return;
  } // Fallback por si acaso
  document.getElementById("modal-titulo-msg").innerText = "Aviso";
  document.getElementById("modal-texto-msg").innerText = mensaje;
  modal.style.display = "flex";
}

function cerrarModalGenerico() {
  document.getElementById("modal-mensaje-generico").style.display = "none";
}

function mostrarConfirmacion(mensaje, callbackAceptar) {
  const modal = document.getElementById("modal-confirmacion-generica");
  if (!modal) {
    if (confirm(mensaje)) callbackAceptar();
    return;
  } // Fallback

  document.getElementById("modal-texto-confirm").innerText = mensaje;
  const btnAceptar = document.getElementById("btn-aceptar-confirm");

  // Clonar para limpiar listeners previos
  const newBtn = btnAceptar.cloneNode(true);
  btnAceptar.parentNode.replaceChild(newBtn, btnAceptar);

  newBtn.addEventListener("click", function () {
    modal.style.display = "none";
    callbackAceptar();
  });

  modal.style.display = "flex";
}

function cerrarModalConfirmacion() {
  document.getElementById("modal-confirmacion-generica").style.display = "none";
}


/* --- CARGAR DATOS --- */
function cargarDatosUsuario() {
  const sesionJson = localStorage.getItem(SESSION_KEY);

  if (!sesionJson) {
    // No podemos usar modal aquí porque la página no cargó, redirigimos directo
    window.location.href = "Login.html";
    return;
  }

  const usuario = JSON.parse(sesionJson);

  // Rellenar Textos
  if (document.querySelector(".nombre-usuario-display"))
    document.querySelector(".nombre-usuario-display").innerText = usuario.usuario;

  if (document.querySelector(".rol-usuario"))
    document.querySelector(".rol-usuario").innerText = "Rol: " + (usuario.rol || "Usuario");

  // Rellenar Inputs
  if (document.getElementById("p-usuario")) document.getElementById("p-usuario").value = usuario.usuario;
  if (document.getElementById("p-email")) document.getElementById("p-email").value = usuario.email;
  if (document.getElementById("p-nacimiento")) document.getElementById("p-nacimiento").value = usuario.nacimiento || "No especificado";
  if (document.getElementById("p-telefono")) document.getElementById("p-telefono").value = usuario.telefono || "";

  const recoveryInput = document.getElementById("p-recovery");
  if (recoveryInput) {
    recoveryInput.value = usuario.emailRecuperacion || "";
  }
}

/* --- GUARDAR CAMBIOS --- */
function guardarCambiosPerfil() {
  const nuevoUsuario = document.getElementById("p-usuario").value;
  const nuevoTelefono = document.getElementById("p-telefono").value;
  const nuevoRecovery = document.getElementById("p-recovery").value;

  if (!nuevoUsuario) {
    mostrarAlerta("El nombre de usuario no puede estar vacío.");
    return;
  }

  // Leer y actualizar sesión
  let usuario = JSON.parse(localStorage.getItem(SESSION_KEY));
  usuario.usuario = nuevoUsuario;
  usuario.telefono = nuevoTelefono;
  usuario.emailRecuperacion = nuevoRecovery;

  localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
  document.querySelector(".nombre-usuario-display").innerText = nuevoUsuario;

  mostrarAlerta("¡Cambios guardados correctamente!");
}

/* --- CERRAR SESIÓN --- */
function cerrarSesion() {
  mostrarConfirmacion("¿Seguro que deseas cerrar tu sesión actual?", function () {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "ColdChain.html";
  });
}

/* --- ELIMINAR CUENTA --- */
function abrirModalEliminarCuenta() {
  document.getElementById("modal-eliminar-cuenta").style.display = "flex";
}

function cerrarModalEliminarCuenta() {
  document.getElementById("modal-eliminar-cuenta").style.display = "none";
}

function confirmarEliminacionCuenta() {
  // Esta función ya es llamada por el botón "Sí, Eliminar" de tu modal existente
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(DB_EQUIPOS_KEY);
  localStorage.removeItem(DB_REPORTES_KEY);

  // Ocultar modal actual
  cerrarModalEliminarCuenta();

  // Mostrar mensaje final y luego redirigir
  // Usamos un pequeño truco: un modal que al cerrar redirige
  const modal = document.getElementById("modal-mensaje-generico");
  document.getElementById("modal-titulo-msg").innerText = "Cuenta Eliminada";
  document.getElementById("modal-texto-msg").innerText = "Tu cuenta ha sido eliminada permanentemente. Adiós.";

  // Cambiamos el comportamiento del botón aceptar temporalmente
  const btn = modal.querySelector("button");
  const originalOnclick = btn.onclick;

  btn.onclick = function () {
    window.location.href = "ColdChain.html";
  };

  modal.style.display = "flex";
}
