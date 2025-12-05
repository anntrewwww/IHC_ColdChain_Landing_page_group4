/* ==========================================================================
   AUTH.JS - GESTIÓN TOTAL DE USUARIOS (Registro, Login, Perfil, Eliminar)
   ========================================================================== */

const DB_USERS_KEY = "coldchain_db_users";
const SESSION_KEY = "coldchain_session";

// Inicializar base de datos si no existe
if (!localStorage.getItem(DB_USERS_KEY)) {
  const usuariosIniciales = [
    {
      usuario: "Admin",
      email: "admin@coldchain.com",
      password: "123",
      nacimiento: "1990-01-01",
      telefono: "+51 999 888 777",
      rol: "Administrador",
      recovery: "admin.recovery@gmail.com",
    },
  ];
  localStorage.setItem(DB_USERS_KEY, JSON.stringify(usuariosIniciales));
}

// ROUTER: Ejecutar funciones según la página
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  // Detecta tanto registro.html como registro2.html
  if (path.includes("registro.html") || path.includes("registro2.html")) {
    iniciarLogicaRegistro();
  } else if (path.includes("Login.html") || path.includes("login.html")) {
    iniciarLogicaLogin();
  } else if (
    path.includes("perfil.html") ||
    path.includes("perfil2.html") ||
    path.includes("perfil3.html")
  ) {
    cargarDatosPerfil();
  }
});

/* ----------------------------------------------------
   1. REGISTRO
   ---------------------------------------------------- */
function iniciarLogicaRegistro() {
  // Selecciona el formulario (funciona para ambos registros)
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Leer inputs
    const inputs = form.querySelectorAll("input");

    // Asumiendo orden estándar: Usuario [0], Email [1], Password [2]
    // Si tu HTML cambia el orden, ajusta estos índices.
    const usuario = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;

    // Leer selects de fecha (si existen)
    const dia = document.getElementById("dia")?.value || "01";
    const mes = document.getElementById("mes")?.value || "01";
    const anio = document.getElementById("anio")?.value || "2000";
    const fechaNac = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

    if (!usuario || !email || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem(DB_USERS_KEY)) || [];
    if (usuarios.find((u) => u.email === email)) {
      alert("Este correo ya está registrado.");
      return;
    }

    const nuevoUsuario = {
      usuario: usuario,
      email: email,
      password: password,
      nacimiento: fechaNac,
      telefono: "",
      rol: "Usuario",
      recovery: ""
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(usuarios));

    // Auto-login
    localStorage.setItem(SESSION_KEY, JSON.stringify(nuevoUsuario));

    alert("¡Registro exitoso! Redirigiendo...");

    // === CAMBIO AQUÍ ===
    // Detectar si estamos en registro2.html para redirigir a index2.html#contacto
    if (window.location.pathname.includes("registro2.html")) {
      window.location.href = "index2.html#contacto";
    } else {
      // Si es el registro normal, va al monitor
      window.location.href = "monitoreo.html";
    }
  });
}

/* ----------------------------------------------------
   2. LOGIN
   ---------------------------------------------------- */
function iniciarLogicaLogin() {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const inputs = form.querySelectorAll("input");
    const email = inputs[0].value;
    const password = inputs[1].value;

    const usuarios = JSON.parse(localStorage.getItem(DB_USERS_KEY)) || [];
    const usuarioEncontrado = usuarios.find((u) => u.email === email && u.password === password);

    if (usuarioEncontrado) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(usuarioEncontrado));
      window.location.href = "monitoreo.html";
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  });
}

/* ----------------------------------------------------
   3. PERFIL
   ---------------------------------------------------- */
function cargarDatosPerfil() {
  const sesion = JSON.parse(localStorage.getItem(SESSION_KEY));

  if (!sesion) {
    alert("No has iniciado sesión.");
    window.location.href = "Login.html";
    return;
  }

  // Llenar campos visuales
  const displayNombre = document.querySelector(".nombre-usuario-display");
  if (displayNombre) displayNombre.innerText = sesion.usuario;

  const displayRol = document.querySelector(".rol-usuario");
  if (displayRol) displayRol.innerText = `Rol: ${sesion.rol || 'Usuario'}`;

  // Llenar formulario
  const setValue = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

  setValue("p-usuario", sesion.usuario);
  setValue("p-email", sesion.email);
  setValue("p-recovery", sesion.recovery);
  setValue("p-nacimiento", sesion.nacimiento);
  setValue("p-telefono", sesion.telefono);
}

window.guardarCambiosPerfil = function () {
  const sesion = JSON.parse(localStorage.getItem(SESSION_KEY));
  const usuarios = JSON.parse(localStorage.getItem(DB_USERS_KEY));

  const nuevoUser = document.getElementById("p-usuario").value;
  const nuevoTel = document.getElementById("p-telefono").value;
  const nuevoRec = document.getElementById("p-recovery").value;

  const index = usuarios.findIndex(u => u.email === sesion.email);
  if (index !== -1) {
    usuarios[index].usuario = nuevoUser;
    usuarios[index].telefono = nuevoTel;
    usuarios[index].recovery = nuevoRec;

    localStorage.setItem(DB_USERS_KEY, JSON.stringify(usuarios));

    sesion.usuario = nuevoUser;
    sesion.telefono = nuevoTel;
    sesion.recovery = nuevoRec;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));

    alert("Perfil actualizado correctamente.");
    const display = document.querySelector(".nombre-usuario-display");
    if (display) display.innerText = nuevoUser;
  }
};

window.cerrarSesion = function () {
  if (confirm("¿Cerrar sesión?")) {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "ColdChain.html";
  }
};

/* ----------------------------------------------------
   4. ELIMINAR CUENTA
   ---------------------------------------------------- */
window.abrirModalEliminarCuenta = function () {
  document.getElementById("modal-eliminar-cuenta").style.display = "flex";
};

window.cerrarModalEliminarCuenta = function () {
  document.getElementById("modal-eliminar-cuenta").style.display = "none";
};

window.confirmarEliminacionCuenta = function () {
  const sesion = JSON.parse(localStorage.getItem(SESSION_KEY));
  let usuarios = JSON.parse(localStorage.getItem(DB_USERS_KEY));

  if (sesion && usuarios) {
    usuarios = usuarios.filter(u => u.email !== sesion.email);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(usuarios));
    localStorage.removeItem(SESSION_KEY);

    alert("Cuenta eliminada.");
    window.location.href = "ColdChain.html";
  }
};
