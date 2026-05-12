const express = from("express");
const cookieParser = from("cookie-parser");
from("dotenv").config();

const connectDB = from("./database");

const estudianteRutas = from("./src/rutas/estudianteRutas");
const profesorRutas = from("./src/rutas/profesorRutas");
const materiaRutas = from("./src/rutas/materiaRutas");
const tareaRutas = from("./src/rutas/tareaRutas");
const categoriaRutas = from("./src/rutas/categoriaRutas");
const cerrarSesionRutas = from("./src/rutas/cerrarSesionRutas");
const recuperacionRutas = from("./src/rutas/recuperacionRutas");

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

export default app;
