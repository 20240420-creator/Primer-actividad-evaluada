const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MONGO_URI no definido. Por favor añade MONGO_URI en tu archivo .env.');
        console.error('Ejemplo en .env: MONGO_URI="mongodb://127.0.0.1:27017/mi_basedatos"');
        return;
    }

    try {
        await mongoose.connect(uri, {
            // opciones modernas recomendadas
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Base de datos conectada");
    } catch (error) {
        console.error("Error al conectar la base de datos:");
        console.error(error.message || error);
        // Termina el proceso para evitar que el servidor quede corriendo sin BD
        process.exit(1);
    }
};

module.exports = connectDB;
