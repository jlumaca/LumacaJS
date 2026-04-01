function mostrarMensaje(id, texto, tipo) {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = texto;
    el.className = "msg " + tipo;
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
function limpiarCampos(){
    document.getElementById("codigo").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("motor").value = "";
    document.getElementById("precio").value = "";
}
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
    const fotoInput = document.getElementById("foto");
    let autos = getAutos();

    if (autos.find(a => a.codigo == codigo)) {
        mostrarMensaje("auto_msg", "El código ya existe", "error");
        return;
    }

    if (fotoInput.files.length > 0) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const fotoBase64 = e.target.result;

            autos.push({ codigo, marca, modelo, motor, precio, foto: fotoBase64 });
            guardarAutos(autos);

            mostrarMensaje("auto_msg", "Auto agregado con foto", "success");
            mostrarAutos(getAutos());
        };

        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        // sin imagen
        autos.push({ codigo, marca, modelo, motor, precio, foto: null });
        guardarAutos(autos);

        mostrarMensaje("auto_msg", "Auto agregado sin foto", "success");
        mostrarAutos(getAutos());
    }
    limpiarCampos();
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
    limpiarCampos();
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
                    ${a.foto ? `<img src="${a.foto}" width="80">` : "Sin foto"}
                </td>
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

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    mostrarAutos(getAutos());
});
function recargar(){
    window.location.reload();
}
document.getElementById("btnAgregar").addEventListener("click", agregarAuto);
document.getElementById("btnModificar").addEventListener("click", modificarAuto);
document.getElementById("btnBuscar").addEventListener("click", buscarAuto);
document.getElementById("btnRecargar").addEventListener("click", recargar);
document.getElementById("btnLogout").addEventListener("click", logout);
