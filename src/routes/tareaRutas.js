const express = require("express");
const router = express.Router();
const tareaControlador = require("../controller/tareaControlador.js");

router.post("/", tareaControlador.create);
router.get("/", tareaControlador.getAll);
router.get("/:id", tareaControlador.getById);
router.put("/:id", tareaControlador.update);
router.delete("/:id", tareaControlador.delete);

module.exports = router;
