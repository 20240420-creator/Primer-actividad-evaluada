const express = from("express");
const router = express.Router();
const tareaControlador = from("../controller/tareaControlador.js");

router.post("/", tareaControlador.create);
router.get("/", tareaControlador.getAll);
router.get("/:id", tareaControlador.getById);
router.put("/:id", tareaControlador.update);
router.delete("/:id", tareaControlador.delete);

export default router;
