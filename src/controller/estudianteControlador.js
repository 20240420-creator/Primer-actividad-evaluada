const bcrypt = require("bcryptjs");
const studentModel = require ("../model/estudiantes.js")

const estudianteControlador = {};


estudianteControlador.register = async (req, res) => {
    try {
        const { name, lastName, email, password, birthdate, phone, grade } = req.body;

        if (!name || !lastName || !email || !password || !birthdate || !phone || !grade) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const existStudent = await studentModel.findOne({ email });
        if (existStudent) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

        const newStudent = new studentModel({
            name,
            lastName,
            email,
            password: encryptedPassword,
            birthdate,
            phone,
            grade,
            isVerified: false,
            loginAttempts: 0,
            timeOut: null,
            verificationCode,
            verificationCodeExpires
        });

        await newStudent.save();

        res.status(201).json({
            message: "Estudiante registrado correctamente. Verifique su correo con el código enviado.",
            verificationCode,
            student: {
                id: newStudent._id,
                name: newStudent.name,
                lastName: newStudent.lastName,
                email: newStudent.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar estudiante", error: error.message });
    }
};


estudianteControlador.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "El correo y el código son obligatorios" });
        }

        const student = await studentModel.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        if (student.verificationCode !== code) {
            return res.status(400).json({ message: "Código incorrecto" });
        }

        if (student.verificationCodeExpires < new Date()) {
            return res.status(400).json({ message: "El código ha expirado" });
        }

        student.isVerified = true;
        student.verificationCode = null;
        student.verificationCodeExpires = null;
        await student.save();

        res.status(200).json({ message: "Correo verificado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al verificar correo", error: error.message });
    }
};


estudianteControlador.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "El correo y la contraseña son obligatorios" });
        }

        const student = await studentModel.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        if (!student.isVerified) {
            return res.status(401).json({ message: "Debe verificar su correo antes de iniciar sesión" });
        }

        if (student.timeOut && student.timeOut > new Date()) {
            return res.status(401).json({ message: "Cuenta bloqueada temporalmente. Intente más tarde." });
        }

        const validPassword = await bcrypt.compare(password, student.password);
        if (!validPassword) {
            student.loginAttempts += 1;

            if (student.loginAttempts >= 5) {
                student.timeOut = new Date(Date.now() + 15 * 60 * 1000);
            }

            await student.save();
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        student.loginAttempts = 0;
        student.timeOut = null;
        await student.save();

        res.cookie("studentSession", student._id.toString(), { httpOnly: true });

        res.status(200).json({
            message: "Inicio de sesión correcto",
            student: {
                id: student._id,
                name: student.name,
                lastName: student.lastName,
                email: student.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
};


estudianteControlador.getAll = async (req, res) => {
    try {
        const estudiantes = await studentModel.find().select("-password -recoveryCode -verificationCode");
        res.status(200).json({ estudiantes });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener estudiantes", error: error.message });
    }
};


estudianteControlador.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentModel.findById(id).select("-password -recoveryCode -verificationCode");

        if (!student) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        res.status(200).json({ student });
    } catch (error) {
        res.status(500).json({ message: "Error al buscar estudiante", error: error.message });
    }
};


estudianteControlador.update = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedStudent = await studentModel.findByIdAndUpdate(id, req.body, { new: true })
            .select("-password -recoveryCode -verificationCode");

        if (!updatedStudent) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        res.status(200).json({ message: "Estudiante actualizado correctamente", student: updatedStudent });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar estudiante", error: error.message });
    }
};


estudianteControlador.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await studentModel.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        res.status(200).json({ message: "Estudiante eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar estudiante", error: error.message });
    }
};

module.exports =  estudianteControlador;
