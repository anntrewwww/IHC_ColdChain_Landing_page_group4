function abrirPestana(evt, pestanaNombre) {
  // 1. Ocultar todos los contenidos con clase "tab-content"
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // 2. Quitar la clase "activo" de todos los botones
  tablinks = document.getElementsByClassName("boton-pestana");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" activo", "");
  }

  // 3. Mostrar el contenido actual y añadir clase "activo" al botón clickeado
  document.getElementById(pestanaNombre).style.display = "flex";
  evt.currentTarget.className += " activo";
} /* ==========================================================================
   SISTEMA COLDCHAIN v7.0 - LOGICA DE ELIMINACIÓN SEPARADA
   ========================================================================== */

const dbEquiposInicial = [
  {
    id: 1,
    nombre: "Cámara Fría A1",
    ubicacion: "Almacén Principal - Zona A",
    tipo: "Congelador",
    temp: -18.2,
    objetivo: -18,
    estado: "normal",
    ultActualizacion: new Date().toLocaleString(),
  },
  {
    id: 2,
    nombre: "Refrigerador B2",
    ubicacion: "Almacén Secundario - Zona B",
    tipo: "Refrigerador",
    temp: 4.8,
    objetivo: 2,
    estado: "warning",
    ultActualizacion: new Date().toLocaleString(),
  },
  {
    id: 3,
    nombre: "Cámara Fría C1",
    ubicacion: "Centro de distribución",
    tipo: "Congelador",
    temp: -12.1,
    objetivo: -18,
    estado: "critical",
    ultActualizacion: new Date().toLocaleString(),
  },
  {
    id: 4,
    nombre: "Refrigerador D3",
    ubicacion: "Almacén Principal - Zona D",
    tipo: "Refrigerador",
    temp: 1.8,
    objetivo: 2,
    estado: "normal",
    ultActualizacion: new Date().toLocaleString(),
  },
];

let equipos =
  JSON.parse(localStorage.getItem("coldchain_equipos")) || dbEquiposInicial;
let reportes = JSON.parse(localStorage.getItem("coldchain_reportes")) || [];

// Variables temporales para saber qué borrar
let idEquipoAEliminar = null;
let idReporteAEliminar = null;
let idEquipoContextoReporte = null; // Para refrescar la tabla correcta

if (!localStorage.getItem("coldchain_equipos")) {
  localStorage.setItem("coldchain_equipos", JSON.stringify(equipos));
}

document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;
  if (path.includes("monitoreo.html")) renderizarMonitor();
  else if (path.includes("generar_equipo.html")) setupFormularioGenerar();
  else if (path.includes("detalle_equipo.html")) cargarDetalleEquipo();
  else if (path.includes("reporte.html")) cargarConfiguracionReporte();
  else if (path.includes("ver_reporte.html")) cargarVistaPrevia();
});

/* ==========================================
 1. LÓGICA DE ELIMINACIÓN DE EQUIPOS
 ========================================== */
function renderizarMonitor() {
  const contenedor = document.querySelector(".grid-equipos");
  if (!contenedor) return;
  contenedor.innerHTML = "";
  let c = 0,
    w = 0,
    n = 0;

  if (equipos.length === 0) {
    contenedor.innerHTML =
      "<p style='grid-column:span 2; text-align:center; padding:20px;'>No hay equipos registrados.</p>";
  }

  equipos.forEach((eq) => {
    if (eq.estado === "critical") c++;
    else if (eq.estado === "warning") w++;
    else n++;

    let badgeClass =
      eq.estado === "normal"
        ? "badge-normal"
        : eq.estado === "warning"
          ? "badge-warning"
          : "badge-critical";
    let textClass =
      eq.estado === "normal"
        ? "texto-verde"
        : eq.estado === "warning"
          ? "texto-amarillo"
          : "texto-rojo";
    let iconState =
      eq.estado === "normal"
        ? "✔ Normal"
        : eq.estado === "warning"
          ? "! Advertencia"
          : "⚠ Crítico";

    const card = `
          <div class="tarjeta-equipo fade-in-up" onclick="irDetalle(${eq.id})">
              <div class="header-equipo">
                  <h4>${eq.nombre}</h4>
                  <span class="badge ${badgeClass}">${iconState}</span>
              </div>
              <p class="ubicacion"><img src="assets/images/geo.png" width="12"> ${eq.ubicacion}</p>
              <div class="datos-equipo">
                  <div><span class="label">Temp. Actual</span><span class="valor ${textClass}"><img src="assets/images/ICON%202.png" width="10"> ${eq.temp}°C</span></div>
                  <div><span class="label">Objetivo</span><span class="valor">${eq.objetivo}°C</span></div>
                  <div><span class="label">Tipo</span><span class="valor">${eq.tipo}</span></div>
              </div>
              <div class="footer-equipo">
                  <div style="display:flex; align-items:center; gap:5px;"><img src="assets/images/timeblack.png" width="12" style="opacity:0.5"> Act: ${eq.ultActualizacion}</div>

                  <!-- BOTÓN LLAMA A FUNCIÓN ESPECÍFICA DE EQUIPO -->
                  <button class="btn-eliminar-card" onclick="abrirModalBorrarEquipo(event, ${eq.id})" title="Eliminar equipo">🗑</button>
              </div>
          </div>`;
    contenedor.innerHTML += card;
  });

  const kpiTotal = document.getElementById("kpi-total");
  if (kpiTotal) kpiTotal.innerText = equipos.length;
  const kpiCrit = document.getElementById("kpi-critico");
  if (kpiCrit) kpiCrit.innerText = c;
  const kpiWarn = document.getElementById("kpi-warn");
  if (kpiWarn) kpiWarn.innerText = w;
  const kpiNorm = document.getElementById("kpi-normal");
  if (kpiNorm) kpiNorm.innerText = n;
}

function irDetalle(id) {
  window.location.href = `detalle_equipo.html?id=${id}`;
}

// --- FUNCIONES MODAL EQUIPO ---
function abrirModalBorrarEquipo(e, id) {
  e.stopPropagation(); // IMPORTANTE: Evita entrar al detalle
  idEquipoAEliminar = id;
  const modal = document.getElementById("modal-borrar-equipo");
  if (modal) modal.style.display = "flex";
}

function cerrarModalBorrarEquipo() {
  idEquipoAEliminar = null;
  const modal = document.getElementById("modal-borrar-equipo");
  if (modal) modal.style.display = "none";
}

function ejecutarBorrarEquipo() {
  if (idEquipoAEliminar !== null) {
    equipos = equipos.filter((eq) => eq.id !== idEquipoAEliminar);
    localStorage.setItem("coldchain_equipos", JSON.stringify(equipos));
    renderizarMonitor();
    cerrarModalBorrarEquipo();
  }
}

/* ==========================================
 2. LÓGICA DE ELIMINACIÓN DE REPORTES
 ========================================== */
function renderizarHistorialReportes(equipoIdActual) {
  const tbody = document.querySelector(".tabla-historial tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const misReportes = reportes.filter((r) =>
    r.equiposIds.includes(parseInt(equipoIdActual))
  );

  if (misReportes.length === 0) {
    tbody.innerHTML =
      "<tr><td colspan='4' style='text-align:center; color:#999; padding:20px;'>No hay reportes generados aún.</td></tr>";
    return;
  }

  misReportes.forEach((rep) => {
    const row = `
          <tr>
              <td>${rep.nombre}</td>
              <td>${rep.fecha}</td>
              <td>${rep.tipo}</td>
              <td style="display:flex; align-items:center;">
                  <a href="ver_reporte.html?idReporte=${rep.id}" target="_blank" class="btn-ver-reporte">👁 Ver</a>

                  <!-- BOTÓN LLAMA A FUNCIÓN ESPECÍFICA DE REPORTE -->
                  <button class="btn-eliminar-tabla" onclick="abrirModalBorrarReporte(${rep.id}, ${equipoIdActual})">🗑</button>
              </td>
          </tr>`;
    tbody.innerHTML += row;
  });
}

// --- FUNCIONES MODAL REPORTE ---
function abrirModalBorrarReporte(idReporte, idEquipo) {
  idReporteAEliminar = idReporte;
  idEquipoContextoReporte = idEquipo;
  const modal = document.getElementById("modal-borrar-reporte");
  if (modal) modal.style.display = "flex";
}

function cerrarModalBorrarReporte() {
  idReporteAEliminar = null;
  idEquipoContextoReporte = null;
  const modal = document.getElementById("modal-borrar-reporte");
  if (modal) modal.style.display = "none";
}

function ejecutarBorrarReporte() {
  if (idReporteAEliminar !== null) {
    reportes = reportes.filter((r) => r.id !== idReporteAEliminar);
    localStorage.setItem("coldchain_reportes", JSON.stringify(reportes));

    // Refrescar tabla del equipo actual
    if (idEquipoContextoReporte) {
      renderizarHistorialReportes(idEquipoContextoReporte);
    }
    cerrarModalBorrarReporte();
  }
}

/* ----------------------------------------------------
 OTRAS LÓGICAS (GENERAR, DETALLE, ETC)
 ---------------------------------------------------- */
function setupFormularioGenerar() {
  const form = document.getElementById("form-generar");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nombre = document.getElementById("nombreEq").value;
      const tipo = document.getElementById("tipoEq").value;
      const ubicacion = document.getElementById("ubiEq").value;
      const obj = parseFloat(document.getElementById("objEq").value);
      const tempIni = parseFloat(document.getElementById("tempIni").value);

      const dif = Math.abs(tempIni - obj);
      let estado = "normal";
      if (dif > 5) estado = "critical";
      else if (dif > 2) estado = "warning";

      const nuevo = {
        id: Date.now(),
        nombre: nombre,
        ubicacion: ubicacion,
        tipo: tipo,
        temp: tempIni,
        objetivo: obj,
        estado: estado,
        ultActualizacion: new Date().toLocaleString(),
      };
      equipos.push(nuevo);
      localStorage.setItem("coldchain_equipos", JSON.stringify(equipos));
      window.location.href = "monitoreo.html";
    });
  }
}

function cargarDetalleEquipo() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const equipo = equipos.find((e) => e.id == id);

  if (!equipo) {
    alert("Equipo no encontrado");
    window.location.href = "monitoreo.html";
    return;
  }

  document.getElementById("det-nombre").innerText = equipo.nombre;
  document.getElementById("det-ubi").innerText = equipo.ubicacion;
  document.getElementById("det-temp").innerText = equipo.temp + "°C";
  document.getElementById("det-obj").innerText = equipo.objetivo + "°C";

  const boxFecha = document.getElementById("box-fecha-update");
  const spanFecha = document.getElementById("det-update");
  spanFecha.innerText = equipo.ultActualizacion;

  const dev = (equipo.temp - equipo.objetivo).toFixed(1);
  const devElem = document.getElementById("det-dev");
  devElem.innerText = (dev > 0 ? "+" : "") + dev + "°C";

  const banner = document.getElementById("banner-estado");
  const badge = document.getElementById("badge-estado");
  const valTemp = document.getElementById("det-temp");

  boxFecha.className = "dato-box info-small";
  banner.className = "banner-estado";

  if (equipo.estado === "critical") {
    banner.classList.add("critico");
    badge.className = "badge-rojo-solido";
    badge.innerText = "⚠ Crítico";
    valTemp.style.color = "#dc2626";
    devElem.style.color = "#dc2626";
    boxFecha.classList.add("texto-rojo");
  } else if (equipo.estado === "warning") {
    banner.style.backgroundColor = "#fef9c3";
    banner.style.borderColor = "#fde047";
    badge.className = "badge-rojo-solido";
    badge.style.backgroundColor = "#eab308";
    badge.innerText = "! Advertencia";
    valTemp.style.color = "#d97706";
    devElem.style.color = "#d97706";
    boxFecha.classList.add("texto-amarillo");
  } else {
    banner.style.backgroundColor = "#dcfce7";
    banner.style.borderColor = "#86efac";
    badge.className = "badge-rojo-solido";
    badge.style.backgroundColor = "#16a34a";
    badge.innerText = "✔ Normal";
    valTemp.style.color = "#16a34a";
    devElem.style.color = "#16a34a";
    boxFecha.classList.add("texto-verde");
  }

  document.getElementById("btn-ir-reporte").href = `reporte.html?id=${id}`;
  generarGraficoCoherente(equipo);
  generar5Eventos(equipo);
  renderizarHistorialReportes(id);
}

function generarGraficoCoherente(equipo) {
  const ctx = document.getElementById('tempChart');
  if (!ctx) return;

  // Destruir gráfico anterior si existe para evitar errores visuales
  if (window.miGrafico) {
    window.miGrafico.destroy();
  }

  let dataPoints = [], colorLinea = '', bgColor = '';

  // Lógica de colores
  if (equipo.estado === 'normal') {
    colorLinea = '#16a34a';
    bgColor = '#dcfce7';
    for (let i = 0; i < 12; i++) dataPoints.push(equipo.objetivo + (Math.random() - 0.5));
  } else if (equipo.estado === 'warning') {
    colorLinea = '#d97706';
    bgColor = '#fef9c3';
    for (let i = 0; i < 12; i++) dataPoints.push(equipo.objetivo + (i * 0.2));
  } else {
    colorLinea = '#dc2626';
    bgColor = '#fee2e2';
    for (let i = 0; i < 10; i++) dataPoints.push(equipo.objetivo + (Math.random() * 0.5));
    dataPoints.push(equipo.temp);
    dataPoints.push(equipo.temp);
  }

  // Crear nuevo gráfico
  window.miGrafico = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      datasets: [{
        label: 'Temp (°C)',
        data: dataPoints,
        borderColor: colorLinea,
        backgroundColor: bgColor,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 2
      }, {
        label: 'Obj',
        data: Array(12).fill(equipo.objetivo),
        borderColor: '#9ca3af',
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, /* CRUCIAL PARA CELULAR */
      plugins: {
        legend: {display: false}
      },
      scales: {
        y: {
          grid: {color: '#f3f4f6'},
          ticks: {font: {size: 10}} // Texto más pequeño en eje Y
        },
        x: {
          grid: {display: false},
          ticks: {font: {size: 9}} // Texto más pequeño en eje X
        }
      }
    }
  });
}

function generar5Eventos(equipo) {
  const container = document.querySelector(".timeline");
  if (!container) return;
  container.innerHTML = "";
  const ahora = new Date();
  const getHora = (h) => {
    let d = new Date(ahora.getTime() - h * 60 * 60 * 1000);
    return (
      d.getHours().toString().padStart(2, "0") +
      ":" +
      d.getMinutes().toString().padStart(2, "0")
    );
  };
  let eventos = [];
  if (equipo.estado === "critical")
    eventos.push({
      hora: getHora(0),
      tipo: "rojo",
      label: "Crítico",
      titulo: `Temperatura crítica: ${equipo.temp}°C`,
      desc: "Riesgo alto.",
    });
  else if (equipo.estado === "warning")
    eventos.push({
      hora: getHora(0),
      tipo: "amarillo",
      label: "Advertencia",
      titulo: `Desviación: ${equipo.temp}°C`,
      desc: "Fuera de rango.",
    });
  else
    eventos.push({
      hora: getHora(0),
      tipo: "azul",
      label: "Información",
      titulo: "Lectura estable",
      desc: "Sistema nominal.",
    });
  eventos.push({
    hora: getHora(2),
    tipo: "azul",
    label: "Información",
    titulo: "Sincronización de datos",
    desc: "Respaldo completado.",
  });
  eventos.push({
    hora: getHora(5),
    tipo: "azul",
    label: "Información",
    titulo: "Verificación",
    desc: "Ping exitoso.",
  });
  eventos.push({
    hora: getHora(8),
    tipo: "azul",
    label: "Información",
    titulo: "Acceso de usuario",
    desc: "Revisión métricas.",
  });
  eventos.push({
    hora: getHora(12),
    tipo: "azul",
    label: "Información",
    titulo: "Inicio de jornada",
    desc: "Verificación sensores OK.",
  });
  eventos.forEach((ev) => {
    container.innerHTML += `<div class="evento"><div class="punto ${ev.tipo}"></div><div class="contenido-evento"><div class="top-evento"><span class="hora">${ev.hora}</span><span class="tag ${ev.tipo}">${ev.label}</span></div><p class="titulo-evt">${ev.titulo}</p><p class="desc-evt">${ev.desc}</p></div></div>`;
  });
}

function cargarConfiguracionReporte() {
  const contenedor = document.getElementById("lista-equipos-check");
  if (!contenedor) return;
  contenedor.innerHTML = "";
  const params = new URLSearchParams(window.location.search);
  const idSelected = params.get("id");
  equipos.forEach((eq) => {
    let badgeClass =
      eq.estado === "normal"
        ? "badge-normal"
        : eq.estado === "warning"
          ? "badge-warning"
          : "badge-critical";
    let labelState =
      eq.estado === "normal"
        ? "Normal"
        : eq.estado === "warning"
          ? "Advertencia"
          : "Crítico";
    let isChecked = eq.id == idSelected ? "checked" : "";
    contenedor.innerHTML += `<div class="equipo-check-wrapper"><input type="checkbox" id="eq-${eq.id}" value="${eq.id}" class="check-equipo" ${isChecked} onchange="actualizarVistaPreviaReporte()"><label for="eq-${eq.id}" class="equipo-card-check"><div><strong>${eq.nombre}</strong><br><small style="color:#666">${eq.ubicacion}</small></div><span class="badge ${badgeClass}">${labelState}</span></label></div>`;
  });
  const btn = document.getElementById("btn-guardar-rep");
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const checkboxes = document.querySelectorAll(".check-equipo:checked");
    if (checkboxes.length === 0) {
      alert("Selecciona al menos un equipo.");
      return;
    }
    let idsSeleccionados = [];
    checkboxes.forEach((cb) => idsSeleccionados.push(parseInt(cb.value)));
    const nuevoReporte = {
      id: Date.now(),
      nombre:
        "Reporte Auditoría " +
        new Date().toLocaleDateString().replace(/\//g, "-"),
      fecha: new Date().toLocaleDateString(),
      tipo: "Completo",
      equiposIds: idsSeleccionados,
    };
    reportes.push(nuevoReporte);
    localStorage.setItem("coldchain_reportes", JSON.stringify(reportes));
    const modal = document.getElementById("modal-exito-reporte");
    if (modal) {
      modal.classList.add("mostrar");
      document.getElementById("btn-cerrar-exito").onclick = function () {
        modal.classList.remove("mostrar");
        window.location.href = `detalle_equipo.html?id=${idsSeleccionados[0]}`;
      };
    }
  });
  actualizarVistaPreviaReporte();
}

function actualizarVistaPreviaReporte() {
  const count = document.querySelectorAll(".check-equipo:checked").length;
  document.getElementById("preview-count-eq").innerText = count;
  document.getElementById("preview-count-data").innerText = count * 24 + "h";
  document.getElementById("preview-count-evt").innerText = count * 4;
}

function toggleChat() {
  document.getElementById("chat-widget").classList.toggle("activo");
}

function toggleMenu() {
  const m = document.getElementById("sideMenu");
  const o = document.getElementById("menuOverlay");
  if (m.classList.contains("abierto")) {
    m.classList.remove("abierto");
    o.classList.remove("activo");
  } else {
    m.classList.add("abierto");
    o.classList.add("activo");
  }
}

function abrirModalCompartir() {
  const m = document.getElementById("modal-share");
  if (m) m.style.display = "flex";
}

function cerrarModalCompartir() {
  const m = document.getElementById("modal-share");
  if (m) m.style.display = "none";
}

function handleChat(e) {
  if (e.key === "Enter") enviarMensaje();
}

function enviarMensaje() {
  const i = document.getElementById("chat-input");
  const t = i.value.trim().toLowerCase();
  if (!t) return;
  const b = document.getElementById("chat-body");
  b.innerHTML += `<div class="mensaje usuario">${i.value}</div>`;
  i.value = "";
  b.scrollTop = b.scrollHeight;
  setTimeout(() => {
    let r = "No entendí.";
    if (t.includes("hola")) r = "¡Hola!";
    else if (t.includes("monitor")) r = "Revisa el panel.";
    else if (t.includes("reporte")) r = "Genera reportes PDF.";
    b.innerHTML += `<div class="mensaje bot">${r}</div>`;
    b.scrollTop = b.scrollHeight;
  }, 800);
}

/* ==========================================
   6. LANDING PAGE & MENÚS (FUNCIONES QUE FALTABAN)
   ========================================== */
function abrirFuncionalidades() {
  const m = document.getElementById("modal-funcionalidades");
  if (m) m.style.display = "flex";
}

function cerrarFuncionalidades() {
  const m = document.getElementById("modal-funcionalidades");
  if (m) m.style.display = "none";
}

let slideIndex = 1;

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (slides.length === 0) return;
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  if (dots.length > 0) dots[slideIndex - 1].className += " active";
}

// Helpers UI
function toggleMenu() {
  const m = document.getElementById("sideMenu");
  const o = document.getElementById("menuOverlay");
  if (m.classList.contains("abierto")) {
    m.classList.remove("abierto");
    o.classList.remove("activo");
  } else {
    m.classList.add("abierto");
    o.classList.add("activo");
  }
}

function abrirModalCompartir() {
  const m = document.getElementById("modal-share");
  if (m) m.style.display = "flex";
}

function cerrarModalCompartir() {
  const m = document.getElementById("modal-share");
  if (m) m.style.display = "none";
}

function toggleChat() {
  document.getElementById("chat-widget").classList.toggle("activo");
}

function handleChat(e) {
  if (e.key === "Enter") enviarMensaje();
}

function enviarMensaje() {
  const input = document.getElementById("chat-input");
  const texto = input.value.trim().toLowerCase();
  if (!texto) return;

  const chatBody = document.getElementById("chat-body");

  // 1. Mensaje del Usuario
  chatBody.innerHTML += `<div class="mensaje usuario">${input.value}</div>`;
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

  // 2. Lógica de Respuesta Inteligente
  setTimeout(() => {
    let respuesta = "";

    // --- COMANDOS Y RESPUESTAS ---

    if (texto.includes("hola") || texto.includes("inicio") || texto.includes("buenos")) {
      respuesta = "¡Hola! Soy el Asistente ColdChain. 🤖<br>Escribe <strong>'tutorial'</strong> para aprender a usar la plataforma, o pregúntame sobre:<br>- Monitor<br>- Reportes<br>- Alertas";
    } else if (texto.includes("tutorial") || texto.includes("guia") || texto.includes("ayuda")) {
      respuesta = "<strong>Guía Rápida:</strong><br>1. <strong>Monitor:</strong> Ve el estado de todos tus equipos.<br>2. <strong>Detalle:</strong> Haz clic en una tarjeta para ver gráficos.<br>3. <strong>Reportes:</strong> Genera PDFs de auditoría.<br>¿Sobre qué tema quieres saber más?";
    } else if (texto.includes("monitor") || texto.includes("panel") || texto.includes("equipos")) {
      respuesta = "📊 <strong>El Monitor</strong> es tu panel principal.<br>Aquí verás tarjetas con cada equipo. Los colores indican su salud:<br><span style='color:#16a34a'>● Verde:</span> Todo bien.<br><span style='color:#d97706'>● Amarillo:</span> Precaución.<br><span style='color:#dc2626'>● Rojo:</span> ¡Acción requerida!";
    } else if (texto.includes("detalle") || texto.includes("grafico")) {
      respuesta = "📈 <strong>Detalle del Equipo:</strong><br>Al hacer clic en un equipo, verás su historial de 24h. La línea punteada es la temperatura ideal. Si la línea sólida se aleja mucho, ¡cuidado!";
    } else if (texto.includes("reporte") || texto.includes("pdf") || texto.includes("auditoria")) {
      respuesta = "📄 <strong>Generador de Reportes:</strong><br>Ve al detalle de un equipo y pulsa el botón negro 'Generar Reporte'. Puedes elegir fechas y qué equipos incluir. Ideal para presentar a DIGEMID/FDA.";
    } else if (texto.includes("crear") || texto.includes("nuevo") || texto.includes("agregar")) {
      respuesta = "➕ <strong>Añadir Sensor:</strong><br>En la pantalla principal (Monitor), busca el botón 'Generar Equipo'. Llena los datos y el sistema empezará a simular lecturas automáticamente.";
    } else if (texto.includes("alerta") || texto.includes("notificacion")) {
      respuesta = "🔔 <strong>Alertas:</strong><br>El sistema te avisará si la temperatura sale del rango seguro. Revisa la sección 'Eventos Recientes' en el detalle del equipo.";
    } else {
      respuesta = "No estoy seguro de esa consulta. 😕<br>Prueba escribiendo <strong>'tutorial'</strong>, <strong>'monitor'</strong> o <strong>'reporte'</strong>.";
    }

    // 3. Mostrar respuesta del Bot
    chatBody.innerHTML += `<div class="mensaje bot">${respuesta}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

  }, 600); // Pequeño retraso para simular que "piensa"
}
