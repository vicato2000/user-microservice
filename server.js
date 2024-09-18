import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from "./middleware/errorMiddleware.js";
import {initializeAdminUser} from "./utils/initializeAdmin.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

initializeAdminUser();

// Opciones de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'API for managing users',
            contact: {
                name: 'Vicente',
            },
            servers: [
                {
                    url: 'http://localhost:5000',
                },
            ],
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1/users', userRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('The server is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`);
});

export default app;
