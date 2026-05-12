const categoryModel = require ("../model/categorias.js");

const categoriaControlador = {};


categoriaControlador.create = async (req, res) => {
    try {
        const { categoryName, description, color, isActive } = req.body;

        if (!categoryName || !description || !color) {
            return res.status(400).json({ message: "El nombre, descripción y color son obligatorios" });
        }

        const newCategory = new categoryModel({ categoryName, description, color, isActive });
        await newCategory.save();

        res.status(201).json({ message: "Categoría creada correctamente", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Error al crear categoría", error: error.message });
    }
};


categoriaControlador.getAll = async (req, res) => {
    try {
        const categorias = await categoryModel.find();
        res.status(200).json({ categorias });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener categorías", error: error.message });
    }
};


categoriaControlador.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ message: "Error al buscar categoría", error: error.message });
    }
};


categoriaControlador.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await categoryModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.status(200).json({ message: "Categoría actualizada correctamente", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar categoría", error: error.message });
    }
};


categoriaControlador.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await categoryModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.status(200).json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar categoría", error: error.message });
    }
};

module.exports = categoriaControlador;
