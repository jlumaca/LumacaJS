function mostrarMensaje(id, texto, tipo) {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = texto;
    el.className = "msg " + tipo;

    // se borra solo después de 3 segundos
    setTimeout(() => {
        el.textContent = "";
    }, 3000);
}
// ===== USUARIOS =====
function getUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function registrar() {
    const user = document.getElementById("reg_user").value;
    const pass = document.getElementById("reg_pass").value;

    let usuarios = getUsuarios();

    if (usuarios.find(u => u.user === user)) {
        mostrarMensaje("reg_msg", "El usuario ya existe", "error");
        return;
    }

    usuarios.push({ user, pass });
    guardarUsuarios(usuarios);

    mostrarMensaje("reg_msg", "Usuario registrado correctamente", "success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}

function login() {
    const user = document.getElementById("login_user").value;
    const pass = document.getElementById("login_pass").value;

    let usuarios = getUsuarios();

    let encontrado = usuarios.find(u => u.user === user && u.pass === pass);

    if (encontrado) {
        localStorage.setItem("usuarioLogueado", user);
        window.location.href = "autos.html";
    } else {
        mostrarMensaje("login_msg", "Credenciales incorrectas", "error");
    }
}

function logout() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
}

// ===== AUTOS =====
function getAutos() {
    return JSON.parse(localStorage.getItem("autos")) || [];
}

function guardarAutos(autos) {
    localStorage.setItem("autos", JSON.stringify(autos));
}

function agregarAuto() {
    const codigo = document.getElementById("codigo").value;
    const marca = document.getElementById("marca").value;
    const modelo = document.getElementById("modelo").value;
    const motor = document.getElementById("motor").value;
    const precio = parseFloat(document.getElementById("precio").value);

    let autos = getAutos();

    if (autos.find(a => a.codigo == codigo)) {
        mostrarMensaje("auto_msg", "El código ya existe", "error");
        return;
    }

    autos.push({ codigo, marca, modelo, motor, precio });
    guardarAutos(autos);

    mostrarMensaje("auto_msg", "Auto agregado correctamente", "success");
    mostrarAutos(getAutos());
}

function eliminarAuto(codigo) {
    let autos = getAutos();
    autos = autos.filter(a => a.codigo != codigo);
    guardarAutos(autos);
    mostrarAutos(getAutos());

    mostrarMensaje("auto_msg", "Auto eliminado", "success");
}

function modificarAuto() {
    const codigo = document.getElementById("codigo").value;
    let autos = getAutos();

    let auto = autos.find(a => a.codigo == codigo);

    if (!auto) {
        mostrarMensaje("auto_msg", "Auto no encontrado", "error");
        return;
    }

    auto.marca = document.getElementById("marca").value;
    auto.modelo = document.getElementById("modelo").value;
    auto.motor = document.getElementById("motor").value;
    auto.precio = parseFloat(document.getElementById("precio").value);

    guardarAutos(autos);
    mostrarAutos(getAutos());

    mostrarMensaje("auto_msg", "Auto modificado", "success");
}

function mostrarAutos(autos) {
    const tabla = document.getElementById("tabla_autos");
    if (!tabla) return;
    tabla.innerHTML = "";

    autos.forEach(a => {
        tabla.innerHTML += `
            <tr>
                <td>${a.codigo}</td>
                <td>${a.marca}</td>
                <td>${a.modelo}</td>
                <td>${a.motor}</td>
                <td>${a.precio}</td>
                <td>
                    <button onclick="eliminarAuto('${a.codigo}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}
function buscarAuto() {
    const codigo = document.getElementById("codigo").value;
    let autos = getAutos();

    let auto = autos.find(a => a.codigo == codigo);

    if (!auto) {
        mostrarMensaje("auto_msg", "Auto no encontrado", "error");
        return;
    }

    // auto.marca = document.getElementById("marca").value;
    // auto.modelo = document.getElementById("modelo").value;
    // auto.motor = document.getElementById("motor").value;
    // auto.precio = parseFloat(document.getElementById("precio").value);

    // guardarAutos(autos);
    mostrarAutos([auto]);

    // mostrarMensaje("auto_msg", "Auto modificado", "success");
}

function recargar(){
    window.location.reload();
}
// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    mostrarAutos(getAutos());
});
