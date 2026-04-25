const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const multer = require("multer");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

function leerArchivo(file) {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file));
}

function guardarArchivo(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const AUTOS_FILE = "data/autos.json";
const USERS_FILE = "data/usuarios.json";
app.use(express.static("public"));

// ---------------- AUTOS ----------------

// Obtener autos
app.get("/autos", (req, res) => {
    res.json(leerArchivo(AUTOS_FILE));
});

app.get("/autos/buscar", (req, res) => {
    const texto = (req.query.q || "").toLowerCase();

    let autos = leerArchivo(AUTOS_FILE);

    let filtrados = autos.filter(a =>
        a.codigo.toLowerCase().includes(texto) ||
        a.marca.toLowerCase().includes(texto) ||
        a.modelo.toLowerCase().includes(texto)
    );

    res.json(filtrados);
});

// Guardar todos los autos
app.post("/autos", (req, res) => {
    guardarArchivo(AUTOS_FILE, req.body);
    res.send("Autos guardados");
});

// Agregar auto
app.post("/auto", upload.single("foto"), (req, res) => {
    let autos = leerArchivo(AUTOS_FILE);
    const nuevoAuto = {
        ...req.body,
        foto: req.file ? req.file.filename : null
    };

    if (!nuevoAuto.codigo) {
        return res.status(400).send("El código es obligatorio");
    }

    const existe = autos.some(a => a.codigo == nuevoAuto.codigo);

    if (existe) {
        return res.status(400).send("El código ya existe");
    }

    autos.push(nuevoAuto);
    guardarArchivo(AUTOS_FILE, autos);

    res.send("Auto agregado");
});

app.use("/uploads", express.static("uploads"));

app.put("/auto/:codigo", upload.single("foto"), (req, res) => {
    const codigo = req.params.codigo;

    let autos = leerArchivo(AUTOS_FILE);
    let index = autos.findIndex(a => a.codigo == codigo);

    if (index === -1) {
        return res.status(404).send("Auto no encontrado");
    }

    // actualizar datos
    autos[index] = {
        ...autos[index],
        ...req.body
    };

    if (req.file) {
        autos[index].foto = req.file.filename;
    }

    guardarArchivo(AUTOS_FILE, autos);

    res.send("Auto modificado");
});

app.delete("/auto/:codigo", (req, res) => {
    const codigo = req.params.codigo;

    let autos = leerArchivo(AUTOS_FILE);

    let nuevosAutos = autos.filter(a => a.codigo != codigo);

    if (autos.length === nuevosAutos.length) {
        return res.status(404).send("Auto no encontrado");
    }

    guardarArchivo(AUTOS_FILE, nuevosAutos);

    res.send("Auto eliminado");
});
// ---------------- USUARIOS ----------------

// Registro
app.post("/registro", (req, res) => {
    const { user, pass } = req.body;

    let usuarios = leerArchivo(USERS_FILE);

    if (usuarios.find(u => u.user === user)) {
        return res.status(400).send("Usuario ya existe");
    }

    usuarios.push({ user, pass });
    guardarArchivo(USERS_FILE, usuarios);

    res.send("Usuario registrado");
});

// Login
app.post("/login", (req, res) => {
    const { user, pass } = req.body;

    let usuarios = leerArchivo(USERS_FILE);

    let index = usuarios.findIndex(u => u.user === user && u.pass === pass);

    if (index === -1) {
        return res.status(401).send("Credenciales incorrectas");
    }

    res.send("Login correcto");
});

app.post("/logout", (req, res) => {
    const { user } = req.body;

    let usuarios = leerArchivo(USERS_FILE);

    let index = usuarios.findIndex(u => u.user === user);

    if (index === -1) {
        return res.status(404).send("Usuario no encontrado");
    }

    res.send("Logout correcto");
});


app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));