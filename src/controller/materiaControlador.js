const subjectModel = from("../model/materias.js");

const materiaControlador = {};


materiaControlador.create = async (req, res) => {
    try {
        const { subjectName, teacher_id, isAvailable } = req.body;

        if (!subjectName || !teacher_id) {
            return res.status(400).json({ message: "El nombre de la materia y el profesor son obligatorios" });
        }

        const newSubject = new subjectModel({ subjectName, teacher_id, isAvailable });
        await newSubject.save();

        res.status(201).json({ message: "Materia registrada correctamente", subject: newSubject });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar materia", error: error.message });
    }
};


materiaControlador.getAll = async (req, res) => {
    try {
        const materias = await subjectModel.find().populate("teacher_id", "name lastName email");
        res.status(200).json({ materias });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener materias", error: error.message });
    }
};


materiaControlador.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await subjectModel.findById(id).populate("teacher_id", "name lastName email");

        if (!subject) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        res.status(200).json({ subject });
    } catch (error) {
        res.status(500).json({ message: "Error al buscar materia", error: error.message });
    }
};


materiaControlador.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSubject = await subjectModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedSubject) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        res.status(200).json({ message: "Materia actualizada correctamente", subject: updatedSubject });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar materia", error: error.message });
    }
};


materiaControlador.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSubject = await subjectModel.findByIdAndDelete(id);

        if (!deletedSubject) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        res.status(200).json({ message: "Materia eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar materia", error: error.message });
    }
};

export default materiaControlador;
