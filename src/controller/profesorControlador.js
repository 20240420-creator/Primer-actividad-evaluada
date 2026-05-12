const bcrypt = require("bcryptjs");
const teacherModel = require("../model/profesores.js");

const profesorControlador = {};


profesorControlador.register = async (req, res) => {
    try {
        const { name, lastName, email, password, phone, speciality } = req.body;

        if (!name || !lastName || !email || !password || !phone || !speciality) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const existTeacher = await teacherModel.findOne({ email });
        if (existTeacher) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

        const newTeacher = new teacherModel({
            name,
            lastName,
            email,
            password: encryptedPassword,
            phone,
            speciality,
            isActive: true,
            isVerified: false,
            loginAttempts: 0,
            timeOut: null,
            verificationCode,
            verificationCodeExpires
        });

        await newTeacher.save();

        res.status(201).json({
            message: "Profesor registrado correctamente. Verifique su correo con el código enviado.",
            verificationCode,
            teacher: {
                id: newTeacher._id,
                name: newTeacher.name,
                lastName: newTeacher.lastName,
                email: newTeacher.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar profesor", error: error.message });
    }
};


profesorControlador.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "El correo y el código son obligatorios" });
        }

        const teacher = await teacherModel.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ message: "Profesor no encontrado" });
        }

        if (teacher.verificationCode !== code) {
            return res.status(400).json({ message: "Código incorrecto" });
        }

        if (teacher.verificationCodeExpires < new Date()) {
            return res.status(400).json({ message: "El código ha expirado" });
        }

        teacher.isVerified = true;
        teacher.verificationCode = null;
        teacher.verificationCodeExpires = null;
        await teacher.save();

        res.status(200).json({ message: "Correo verificado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al verificar correo", error: error.message });
    }
};


profesorControlador.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "El correo y la contraseña son obligatorios" });
        }

        const teacher = await teacherModel.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ message: "Profesor no encontrado" });
        }

        if (!teacher.isVerified) {
            return res.status(401).json({ message: "Debe verificar su correo antes de iniciar sesión" });
        }

        if (teacher.timeOut && teacher.timeOut > new Date()) {
            return res.status(401).json({ message: "Cuenta bloqueada temporalmente. Intente más tarde." });
        }

        const validPassword = await bcrypt.compare(password, teacher.password);
        if (!validPassword) {
            teacher.loginAttempts += 1;

            if (teacher.loginAttempts >= 5) {
                teacher.timeOut = new Date(Date.now() + 15 * 60 * 1000);
            }

            await teacher.save();
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        teacher.loginAttempts = 0;
        teacher.timeOut = null;
        await teacher.save();

        res.cookie("teacherSession", teacher._id.toString(), { httpOnly: true });

        res.status(200).json({
            message: "Inicio de sesión correcto",
            teacher: {
                id: teacher._id,
                name: teacher.name,
                lastName: teacher.lastName,
                email: teacher.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
};


profesorControlador.getAll = async (req, res) => {
    try {
        const profesores = await teacherModel.find().select("-password -recoveryCode -verificationCode");
        res.status(200).json({ profesores });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener profesores", error: error.message });
    }
};


profesorControlador.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await teacherModel.findById(id).select("-password -recoveryCode -verificationCode");

        if (!teacher) {
            return res.status(404).json({ message: "Profesor no encontrado" });
        }

        res.status(200).json({ teacher });
    } catch (error) {
        res.status(500).json({ message: "Error al buscar profesor", error: error.message });
    }
};


profesorControlador.update = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedTeacher = await teacherModel.findByIdAndUpdate(id, req.body, { new: true })
            .select("-password -recoveryCode -verificationCode");

        if (!updatedTeacher) {
            return res.status(404).json({ message: "Profesor no encontrado" });
        }

        res.status(200).json({ message: "Profesor actualizado correctamente", teacher: updatedTeacher });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar profesor", error: error.message });
    }
};


profesorControlador.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTeacher = await teacherModel.findByIdAndDelete(id);

        if (!deletedTeacher) {
            return res.status(404).json({ message: "Profesor no encontrado" });
        }

        res.status(200).json({ message: "Profesor eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar profesor", error: error.message });
    }
};

module.exports = profesorControlador;
