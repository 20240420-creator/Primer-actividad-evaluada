const express = from("express");
const router = express.Router();
const estudianteControlador = from("../controller/estudianteControlador.js");

router.post("/register", estudianteControlador.register);
router.post("/verify-email", estudianteControlador.verifyEmail);
router.post("/login", estudianteControlador.login);
router.get("/", estudianteControlador.getAll);
router.get("/:id", estudianteControlador.getById);
router.put("/:id", estudianteControlador.update);
router.delete("/:id", estudianteControlador.delete);

export default router;
