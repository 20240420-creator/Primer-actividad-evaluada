const express = require("express");
const router = express.Router();
const recuperacionControlador = require("../controller/recuperacionControlador.js");

router.post("/send-code", recuperacionControlador.sendCode);
router.post("/reset-password", recuperacionControlador.resetPassword);

module.exports = router;
