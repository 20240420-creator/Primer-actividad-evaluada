const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./database");

const estudianteRutas = require("./src/routes/estudianteRutas.js");
const profesorRutas = require("./src/routes/profesorRutas.js");
const materiaRutas = require("./src/routes/materiaRutas.js");
const tareaRutas = require("./src/routes/tareaRutas.js");
const categoriaRutas = require("./src/routes/categoriaRutas.js");
const cerrarSesionRutas = require("./src/routes/cerrarSesionRutas.js");
const recuperacionRutas = require("./src/routes/recuperacionRutas.js");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/api/estudiantes", estudianteRutas);
app.use("/api/profesores", profesorRutas);
app.use("/api/materias", materiaRutas);
app.use("/api/tareas", tareaRutas);
app.use("/api/categorias", categoriaRutas);
app.use("/api/logout", cerrarSesionRutas);
app.use("/api/recovery", recuperacionRutas);

app.get("/", (req, res) => {
    res.send("API funcionando correctamente");
});

module.exports = app;
