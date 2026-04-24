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

async function registrar() {
    const user = document.getElementById("reg_user").value;
    const pass = document.getElementById("reg_pass").value;

    const res = await fetch("http://localhost:3000/registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, pass })
    });

    if (res.ok) {
        mostrarMensaje("reg_msg", "Usuario registrado", "success");
    } else {
        mostrarMensaje("reg_msg", await res.text(), "error");
    }
}

async function login() {
    const user = document.getElementById("login_user").value;
    const pass = document.getElementById("login_pass").value;

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, pass })
    });

    if (res.ok) {
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
async function getAutos() {
    const res = await fetch("http://localhost:3000/autos");
    return await res.json();
}

function guardarAutos(autos) {
    localStorage.setItem("autos", JSON.stringify(autos));
}

async function agregarAuto() {
    const formData = new FormData();

    formData.append("codigo", document.getElementById("codigo").value);
    formData.append("marca", document.getElementById("marca").value);
    formData.append("modelo", document.getElementById("modelo").value);
    formData.append("motor", document.getElementById("motor").value);
    formData.append("precio", document.getElementById("precio").value);

    const foto = document.getElementById("foto").files[0];
    if (foto) {
        formData.append("foto", foto);
    }

    const res = await fetch("http://localhost:3000/auto", {
        method: "POST",
        body: formData
    });

    if (res.ok) {
        mostrarMensaje("auto_msg", "Auto agregado", "success");
        mostrarAutos(await getAutos());
    } else {
        mostrarMensaje("auto_msg", await res.text(), "error");
    }
}

async function eliminarAuto(codigo) {
    const res = await fetch(`http://localhost:3000/auto/${codigo}`, {
        method: "DELETE"
    });

    if (res.ok) {
        mostrarMensaje("auto_msg", "Auto eliminado", "success");
        mostrarAutos(await getAutos());
    } else {
        mostrarMensaje("auto_msg", "Error al eliminar", "error");
    }
}

async function modificarAuto() {
    const codigo = document.getElementById("codigo").value;

    const marca = document.getElementById("marca").value;
    const modelo = document.getElementById("modelo").value;
    const motor = document.getElementById("motor").value;
    const precio = document.getElementById("precio").value;
    const fotoInput = document.getElementById("foto");

    const formData = new FormData();

    if (marca) formData.append("marca", marca);
    if (modelo) formData.append("modelo", modelo);
    if (motor) formData.append("motor", motor);
    if (precio) formData.append("precio", precio);

    if (fotoInput.files.length > 0) {
        formData.append("foto", fotoInput.files[0]);
    }

    const res = await fetch(`http://localhost:3000/auto/${codigo}`, {
        method: "PUT",
        body: formData
    });

    if (res.ok) {
        mostrarAutos(await getAutos());
        mostrarMensaje("auto_msg", "Auto modificado", "success");
    } else {
        mostrarMensaje("auto_msg", await res.text(), "error");
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
                    <img src="http://localhost:3000/uploads/${a.foto}" width="80">
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
document.getElementById("busqueda").addEventListener("input", async function () {
    let texto = this.value;

    const res = await fetch(`http://localhost:3000/autos/buscar?q=${texto}`);
    const autos = await res.json();

    mostrarAutos(autos);
});

document.addEventListener("DOMContentLoaded", async () => {
    const autos = await getAutos();
    mostrarAutos(autos);
});

document.getElementById("btnAgregar").addEventListener("click", agregarAuto);
document.getElementById("btnModificar").addEventListener("click", modificarAuto);
document.getElementById("btnRecargar").addEventListener("click", async () => {
    const autos = await getAutos();
    mostrarAutos(autos);
});
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


