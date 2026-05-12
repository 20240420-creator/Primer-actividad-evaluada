const express = require("express");
const router = express.Router();
const materiaControlador = require("../controller/materiaControlador.js");

router.post("/", materiaControlador.create);
router.get("/", materiaControlador.getAll);
router.get("/:id", materiaControlador.getById);
router.put("/:id", materiaControlador.update);
router.delete("/:id", materiaControlador.delete);

module.exports = router;
