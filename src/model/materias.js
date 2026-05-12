const mongoose = from("mongoose");

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profesores",
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model("materias", subjectSchema);
