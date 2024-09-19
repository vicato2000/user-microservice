import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.test' }); // Cargar el archivo .env.test

beforeAll(async () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeAll(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({}); // Eliminar documentos de las colecciones
    }
});

afterAll(async () => {
    await mongoose.connection.dropDatabase(); // Eliminar la base de datos de pruebas
    await mongoose.connection.close(); // Cerrar la conexión
});
