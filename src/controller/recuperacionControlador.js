const bcrypt = from("bcryptjs");
const studentModel = from("../model/estudiantes.js");
const teacherModel = from("../model/profesores.js");

const recuperacionControlador = {};

recuperacionControlador.sendCode = async (req, res) => {
    try {
        const { email, userType } = req.body;

        if (!email || !userType) {
            return res.status(400).json({ message: "El correo y el tipo de usuario son obligatorios" });
        }

        let user;
        if (userType === "student") {
            user = await studentModel.findOne({ email });
        } else if (userType === "teacher") {
            user = await teacherModel.findOne({ email });
        } else {
            return res.status(400).json({ message: "Tipo de usuario no válido. Use 'student' o 'teacher'" });
        }

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.recoveryCode = code;
        user.recoveryCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        res.status(200).json({
            message: "Código de recuperación generado. En producción se enviará al correo.",
            recoveryCode: code
        });
    } catch (error) {
        res.status(500).json({ message: "Error al generar código de recuperación", error: error.message });
    }
};


recuperacionControlador.resetPassword = async (req, res) => {
    try {
        const { email, userType, code, newPassword } = req.body;

        if (!email || !userType || !code || !newPassword) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        let user;
        if (userType === "student") {
            user = await studentModel.findOne({ email });
        } else if (userType === "teacher") {
            user = await teacherModel.findOne({ email });
        } else {
            return res.status(400).json({ message: "Tipo de usuario no válido" });
        }

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.recoveryCode !== code) {
            return res.status(400).json({ message: "Código incorrecto" });
        }

        if (user.recoveryCodeExpires < new Date()) {
            return res.status(400).json({ message: "El código ya expiró" });
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        user.password = encryptedPassword;
        user.recoveryCode = null;
        user.recoveryCodeExpires = null;
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al cambiar contraseña", error: error.message });
    }
};

export default recuperacionControlador;
