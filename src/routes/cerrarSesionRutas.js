const express = require("express");
const router = express.Router();
const cerrarSesionControlador = require("../controller/cerrarSesionControlador.js");

router.post("/", cerrarSesionControlador.logout);

module.exports = router;
