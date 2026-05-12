const express = from("express");
const router = express.Router();
const cerrarSesionControlador = from("../controller/cerrarSesionControlador.js");

router.post("/", cerrarSesionControlador.logout);

export default router;
