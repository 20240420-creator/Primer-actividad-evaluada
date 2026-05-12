const express = from("express");
const router = express.Router();
const materiaControlador = from("../controller/materiaControlador.js");

router.post("/", materiaControlador.create);
router.get("/", materiaControlador.getAll);
router.get("/:id", materiaControlador.getById);
router.put("/:id", materiaControlador.update);
router.delete("/:id", materiaControlador.delete);

export default router;
