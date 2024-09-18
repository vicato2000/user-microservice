import request from 'supertest';
import app from '../server.js';

describe('User Registration', () => {
    it('Debe registrar un nuevo usuario', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Juan',
                surname: 'Perez',
                email: 'juan.perez@example.com',
                password: '123456',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('No debe registrar un usuario con un email duplicado', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Juan',
                surname: 'Perez',
                email: 'juan.perez@example.com',  // Email duplicado
                password: '123456',
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'El usuario ya existe');
    });
});
