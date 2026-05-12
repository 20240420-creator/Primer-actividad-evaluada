const taskModel = from("../model/tareas.js");

const tareaControlador = {};


tareaControlador.create = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status, student_id, subject_id } = req.body;

        if (!title || !description || !dueDate || !student_id) {
            return res.status(400).json({ message: "Los campos título, descripción, fecha límite y estudiante son obligatorios" });
        }

        const newTask = new taskModel({
            title,
            description,
            dueDate,
            priority,
            status,
            student_id,
            subject_id
        });

        await newTask.save();

        res.status(201).json({ message: "Tarea creada correctamente", task: newTask });
    } catch (error) {
        res.status(500).json({ message: "Error al crear tarea", error: error.message });
    }
};


tareaControlador.getAll = async (req, res) => {
    try {
        const tareas = await taskModel.find().populate("student_id", "name lastName email").populate("subject_id", "subjectName");
        res.status(200).json({ tareas });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tareas", error: error.message });
    }
};


tareaControlador.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskModel.findById(id).populate("student_id", "name lastName email").populate("subject_id", "subjectName");

        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ message: "Error al buscar tarea", error: error.message });
    }
};


tareaControlador.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await taskModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        res.status(200).json({ message: "Tarea actualizada correctamente", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar tarea", error: error.message });
    }
};


tareaControlador.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await taskModel.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        res.status(200).json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar tarea", error: error.message });
    }
};

export default tareaControlador;
