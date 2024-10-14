import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Audit from "../models/Audit.js";


export const initializeUsers = async () => {
    try {
        const defaultUsers = [
            { name: 'Admin', surname: 'User', email: 'admin@example.com', username: 'admin', password: 'admin123', role: 'admin' },
            { name: 'John', surname: 'Doe', email: 'john.doe@example.com', username: 'johnDoe', password: 'password123', role: 'user' },
            { name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com', username: 'janeSmith', password: 'password123', role: 'user' },
            { name: 'Test', surname: 'User', email: 'test.user@example.com', username: 'testUser', password: 'password123', role: 'user' },
        ];

        for (const userData of defaultUsers) {
            const userExists = await User.findOne({ email: userData.email });

            if (!userExists) {
                const hashedPassword = bcrypt.hashSync(userData.password, 10);

                const newUser = await User.create({
                    name: userData.name,
                    surname: userData.surname,
                    email: userData.email,
                    username: userData.username,
                    password: hashedPassword,
                    role: userData.role,
                });

                console.log(`Usuario creado: ${newUser.email}`);
            } else {
                console.log(`El usuario con email ${userData.email} ya existe.`);
            }
        }
    } catch (error) {
        console.error(`Error al crear usuarios: ${error}`);
    }
};
