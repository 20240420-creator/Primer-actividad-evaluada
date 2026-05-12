const express = from("express");
const router = express.Router();
const categoriaControlador = from("../controller/categoriaControlador.js");

router.post("/", categoriaControlador.create);
router.get("/", categoriaControlador.getAll);
router.get("/:id", categoriaControlador.getById);
router.put("/:id", categoriaControlador.update);
router.delete("/:id", categoriaControlador.delete);

export default router;
