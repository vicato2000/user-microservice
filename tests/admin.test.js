import request from 'supertest';
import { app, server } from '../server.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import {initializeUsers} from "../utils/initializeAdmin.js";

describe('Admin Controller Tests', () => {
    let adminToken, userToken, userId, adminId;
    let testServer;

    beforeAll(async () => {

        await initializeUsers();


        let testServer = app.listen(5001);

        const res = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        adminToken = res.body.token;
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

    // afterAll((done) => {
    //     testServer.close(() => {
    //         console.log('Server closed');
    //         done();
    //     });
    // });


    it('should create a new admin user', async () => {

        await initializeUsers();


        const pres = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        adminToken = pres.body.token;

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
        console.log('Admin user:', res.body);


        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');

    });

    it('should not allow duplicate admin creation', async () => {

        await initializeUsers();


        const pres = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        adminToken = pres.body.token;

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

        // john.doe@example.com

        await initializeUsers();


        const pres = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        adminToken = pres.body.token;

        const res2 = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123',
            });

        userToken = res2.body.token;
        userId = res2.body._id;

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

        await initializeUsers();


        const pres = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        adminToken = pres.body.token;

        const res = await request(app)
            .get('/api/v1/admin/audits')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should check if a user is admin', async () => {

        await initializeUsers();


        const pres = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        adminToken = pres.body.token;



        const res = await request(app)
            .get('/api/v1/admin/users/check-admin')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.isAdmin).toBe(true);
    });


    it('should return audits for a specific user', async () => {

        await initializeUsers();


        const pres = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        adminToken = pres.body.token;

        const res2 = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123',
            });

        userToken = res2.body.token;
        userId = res2.body._id;

        const res = await request(app)
            .get(`/api/v1/admin/users/${userId}/audits`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
