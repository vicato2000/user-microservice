// tests/users.test.js
import request from 'supertest';
import app from '../server.js';

let userToken;
let userId;

describe('User API tests', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/v1/users/register')
            .send({
                name: 'John',
                surname: 'Doe',
                email: 'john.doe2@example.com',
                username: 'johndoe1234',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');  // Verifica que el token exista
        expect(res.body.email).toBe('john.doe2@example.com');  // Verifica el email directamente
        userToken = res.body.token; // Guardar token para futuras pruebas
        userId = res.body._id; // Guardar el ID del usuario
    });

    it('should not allow duplicate email registration', async () => {
        const res = await request(app)
            .post('/api/v1/users/register')
            .send({
                name: 'John',
                surname: 'Doe',
                email: 'john.doe2@example.com',
                username: 'johndoe1234',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('The user already exists');  // Ajusta el mensaje esperado
    });

    it('should log in the user and return a token', async () => {
        const res = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'john.doe2@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe('john.doe2@example.com');  // Verifica directamente el email
    });

    it('should not log in with incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'john.doe2@example.com',
                password: 'wrongpassword',
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Invalid email or password');  // Ajusta el mensaje esperado
    });

    it('should get user profile for authenticated user', async () => {
        const res = await request(app)
            .get('/api/v1/users/profile')
            .set('Authorization', `Bearer ${userToken}`);  // Usa el token obtenido en el registro
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('email');
        expect(res.body.email).toBe('john.doe2@example.com');
    });

    it('should update user profile', async () => {
        const res = await request(app)
            .put(`/api/v1/users/profile`)  // Verifica que la ruta esté correctamente configurada
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'John Updated',
                surname: 'Doe Updated',
                email: 'john.doe2@example.com',
                username: 'johndoe1234',

            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('John Updated');
        expect(res.body.surname).toBe('Doe Updated');
    });

    it('should delete the user', async () => {
        const res = await request(app)
            .post('/api/v1/users/delete')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                password: 'password123',  // Enviar la contraseña junto con la solicitud
            });
        expect(res.statusCode).toEqual(200);  // Asegúrate de que devuelva un 200 si la eliminación es exitosa
        expect(res.body.message).toBe('User account deleted successfully');
    });

});
