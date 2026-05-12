const cerrarSesionControlador = {};

cerrarSesionControlador.logout = async (req, res) => {
    try {
        res.clearCookie("studentSession");
        res.clearCookie("teacherSession");
        res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al cerrar sesión", error: error.message });
    }
};

module.exports = cerrarSesionControlador;
