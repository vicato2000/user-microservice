import request from 'supertest';
import app from '../server.js'; // Asegúrate de importar tu servidor Express

describe('User API tests', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/v1/users/register')
            .send({
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                username: 'johndoe123',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should log in the user and return a token', async () => {
        const res = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
