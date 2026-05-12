const express = from("express");
const router = express.Router();
const recuperacionControlador = from("../controller/recuperacionControlador.js");

router.post("/send-code", recuperacionControlador.sendCode);
router.post("/reset-password", recuperacionControlador.resetPassword);

export default router;
