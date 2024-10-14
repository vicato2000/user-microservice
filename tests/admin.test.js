import request from 'supertest';
import app from '../server.js'; // Asegúrate de apuntar al archivo del servidor
import User from '../models/User.js';
import mongoose from 'mongoose';

describe('Admin Controller Tests', () => {
    let adminToken, userToken, userId, adminId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        adminToken = res.body;
        console.log('Admin token:', adminToken);

        const res2 = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123',
            });

        userToken = res2.body.token;
        userId = res2.body._id;
    });


    it('should create a new admin user', async () => {
        const res = await request(app)
            .post('/api/v1/admin/users/create-admin')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'NewAdmin',
                surname: 'User',
                email: 'newadmin@example.com',
                username: 'newadminuser',
                password: 'adminpassword'
            });
        console.log('Admin token:', adminToken);


        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');

    });

    it('should not allow duplicate admin creation', async () => {
        const res = await request(app)
            .post('/api/v1/admin/users/create-admin')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'NewAdmin',
                surname: 'User',
                email: 'newadmin@example.com', // Misma dirección de email
                username: 'newadminuser',
                password: 'adminpassword'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('User already exists');
    });

    it('should update user role', async () => {
        const res = await request(app)
            .put(`/api/v1/admin/users/${userId}/role`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ role: 'admin' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('User role updated successfully');

        // Verificar que el rol ha sido actualizado
        const updatedUser = await User.findById(userId);
        expect(updatedUser.role).toBe('admin');
    });

    it('should get all audits', async () => {
        const res = await request(app)
            .get('/api/v1/admin/audits')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should check if a user is admin', async () => {
        const res = await request(app)
            .get('/api/v1/admin/users/check-admin')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.isAdmin).toBe(true);
    });


    it('should return audits for a specific user', async () => {
        const res = await request(app)
            .get(`/api/v1/admin/users/${adminId}/audits`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
