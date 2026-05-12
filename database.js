const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MONGO_URI no definido. Por favor añade MONGO_URI en tu archivo .env.');
        console.error('Ejemplo en .env: MONGO_URI="mongodb+srv://usuario:pass@cluster.mongodb.net/mi_basedatos?retryWrites=true&w=majority"');
        return;
    }

    try {
   
        await mongoose.connect(uri);
        console.log("Base de datos conectada");
    } catch (error) {
        console.error("Error al conectar la base de datos:");
        console.error(error.message || error);
        process.exit(1);
    }
};

module.exports = connectDB;
