const express = require("express");
const router = express.Router();
const profesorControlador = require("../controller/profesorControlador.js");

router.post("/register", profesorControlador.register);
router.post("/verify-email", profesorControlador.verifyEmail);
router.post("/login", profesorControlador.login);
router.get("/", profesorControlador.getAll);
router.get("/:id", profesorControlador.getById);
router.put("/:id", profesorControlador.update);
router.delete("/:id", profesorControlador.delete);

module.exports = router;
