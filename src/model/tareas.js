const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ["baja", "media", "alta"],
        default: "media"
    },
    status: {
        type: String,
        enum: ["pendiente", "en progreso", "completada"],
        default: "pendiente"
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "estudiantes",
        required: true
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "materias",
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("tareas", taskSchema);
