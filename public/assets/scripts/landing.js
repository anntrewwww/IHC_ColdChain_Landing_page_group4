/* ============================================= */
/*  LÓGICA DE LA LANDING PAGE (INDEX.HTML)       */
/* ============================================= */

// --- UTILIDADES DE MODALES ---
function cerrarModal(id) {
  document.getElementById(id).style.display = "none";
}

// --- 1. CONTACTO (SOLICITUD) ---
function enviarSolicitudContacto(e) {
  e.preventDefault(); // Evita recarga

  const modal = document.getElementById("modal-solicitud-exito");
  modal.style.display = "flex";

  // Cerrar automático en 3 segundos
  setTimeout(() => {
    modal.style.display = "none";
    document.getElementById("form-contacto").reset(); // Limpia formulario
  }, 3000);
}

// --- 2. PAGO (EMPRESARIAL) ---
function abrirModalPago() {
  document.getElementById("modal-pago").style.display = "flex";
}

function procesarPago(e) {
  e.preventDefault();

  // Cerrar modal de formulario
  cerrarModal("modal-pago");

  // Abrir modal de éxito
  const modalExito = document.getElementById("modal-pago-exito");
  modalExito.style.display = "flex";

  // Redirigir después de 2 segundos
  setTimeout(() => {
    // En una app real, aquí crearías la sesión.
    // Por ahora redirigimos al monitor (o login si prefieres forzar autenticación)
    window.location.href = "monitoreo.html";
  }, 2000);
}

// --- 3. VENTAS (CORPORATIVO) ---
function abrirModalVentas() {
  document.getElementById("modal-ventas").style.display = "flex";
}

function enviarCorreoVentas(e) {
  e.preventDefault();

  cerrarModal("modal-ventas");

  const modalExito = document.getElementById("modal-ventas-exito");
  modalExito.style.display = "flex";

  setTimeout(() => {
    modalExito.style.display = "none";
  }, 3000);
}

/* ============================================= */
/*  MENÚ HAMBURGUESA (LANDING PAGE)              */

/* ============================================= */
function toggleMenuLanding() {
  const menu = document.getElementById("menuLateralLanding");
  const overlay = document.getElementById("overlayMenuLanding");

  if (menu.classList.contains("abierto")) {
    menu.classList.remove("abierto");
    overlay.classList.remove("activo");
  } else {
    menu.classList.add("abierto");
    overlay.classList.add("activo");
  }
}

document.querySelectorAll('.menu-lateral-landing a').forEach(link => {
  link.addEventListener('click', () => {
    toggleMenuLanding();
  });
});
