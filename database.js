const mongoose = from("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Base de datos conectada");
    } catch (error) {
        console.log("Error al conectar la base de datos");
        console.log(error);
    }
};

export default connectDB;
