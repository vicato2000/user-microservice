import bcrypt from 'bcryptjs';
import User from '../models/User.js';


export const initializeAdminUser = async () => {
    try {
        const adminUser = await User.findOne({ role: 'admin', username: 'admin' });

        if (!adminUser) {
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
            const adminUsername = process.env.ADMIN_USERNAME || 'admin';

            const hashedPassword = bcrypt.hashSync(adminPassword, 10);

            const newAdmin = await User.create({
                name: 'admin',
                surname: 'admin',
                email: adminEmail,
                username: adminUsername,
                password: hashedPassword,
                role: 'admin',
            });

            console.log(`Usuario admin creado: ${newAdmin.email}`);
        } else {
            console.log('El usuario admin ya existe');
        }
    } catch (error) {
        console.error(`Error al crear el usuario admin: ${error.message}`);
    }
};
