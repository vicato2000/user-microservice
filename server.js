import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import auditRouter from "./routes/auditRouter.js";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from "./middleware/errorMiddleware.js";
import {initializeUsers} from "./utils/initializeAdmin.js";

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());



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

app.use('/api/v1/admin', adminRoutes);

app.use('/api/v1/audit', auditRouter);


app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('The server is running...');
});


let server;

// Solo inicia el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    await initializeUsers();
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
        console.log(`Server is running in port ${PORT}`);
    });
}

export { app, server };


