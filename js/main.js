function mostrarMensaje(id, texto, tipo) {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = texto;
    el.className = "alert alert-" + (tipo === "error" ? "danger" : "success");

    setTimeout(() => {
        el.textContent = "";
        el.className = "";
    }, 3000);
}
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
        window.location.href = "../index.html";
    }, 1500);
}

function login() {
    const user = document.getElementById("login_user").value;
    const pass = document.getElementById("login_pass").value;

    let usuarios = getUsuarios();

    let encontrado = usuarios.find(u => u.user === user && u.pass === pass);

    if (encontrado) {
        localStorage.setItem("usuarioLogueado", user);
        window.location.href = "templates/autos.html";
    } else {
        mostrarMensaje("login_msg", "Credenciales incorrectas", "error");
    }
}

function logout() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "../index.html";
}

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
    const marca = document.getElementById("marca").value;
    const modelo = document.getElementById("modelo").value;
    const motor = document.getElementById("motor").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const fotoInput = document.getElementById("foto");

    let autos = getAutos();
    let auto = autos.find(a => a.codigo == codigo);

    if (!auto) {
        mostrarMensaje("auto_msg", "Auto no encontrado", "error");
        return;
    }
    if (fotoInput.files.length > 0) {
        const reader = new FileReader();

        reader.onload = function (e) {
            if (marca) auto.marca = marca;
            if (modelo) auto.modelo = modelo;
            if (motor) auto.motor = motor;
            if (precio) auto.precio = precio;
            auto.foto = e.target.result;

            guardarAutos(autos);
            mostrarAutos(getAutos());

            mostrarMensaje("auto_msg", "Auto modificado con nueva foto", "success");
        };

        reader.readAsDataURL(fotoInput.files[0]);

    } else {
        if (marca) auto.marca = marca;
        if (modelo) auto.modelo = modelo;
        if (motor) auto.motor = motor;
        if (precio) auto.precio = precio;

        guardarAutos(autos);
        mostrarAutos(getAutos());

        mostrarMensaje("auto_msg", "Auto modificado", "success");
    }
    limpiarCampos();
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
                    <button class="btn btn-danger btn-sm" onclick="eliminarAuto('${a.codigo}')">
                        🗑 Eliminar
                    </button>
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
    mostrarAutos([auto]);
}

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
//"Decorador" => si el usuario no esta logeado redirige al login (index.html)
document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("usuarioLogueado");
    if (!usuario) {
        mostrarMensaje("login_msg", "Debes iniciar sesión para ingresar a Gestión de Autos", "error");
        window.location.href = "../index.html";
    }else{
        mostrarAutos(getAutos());
    }
});
document.getElementById("busqueda").addEventListener("input", function () {
    let texto = this.value.toLowerCase();
    let autos = getAutos();

    let filtrados = autos.filter(a =>
        a.marca.toLowerCase().includes(texto) ||
        a.modelo.toLowerCase().includes(texto)
    );

    mostrarAutos(filtrados);
});

document.getElementById("codigo").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        buscarAuto();
    }
});

document.getElementById("foto").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const img = document.getElementById("preview");
        img.src = e.target.result;
        img.classList.remove("d-none");
    };

    reader.readAsDataURL(file);
    reader.onload = function(e) {
        const img = document.getElementById("preview");
        img.src = e.target.result;
        img.classList.remove("d-none");
        setTimeout(() => {
            img.classList.add("d-none");
        }, 3000);
    };
});


