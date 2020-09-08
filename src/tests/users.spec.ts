import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import db from '@database/connection';

describe('user', () => {
    const userInfo = { token: '' };

    beforeAll(async () => {
        await db.migrate.rollback();
        await db.migrate.latest();
    });

    afterAll(async () => {
        await db.destroy();
    });

    test('It should to return a void array', async () => {
        const response = await request(app).get('/users');

        expect(response.body).toEqual([]);
    });

    test('It should be able to create an user', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'username',
                email: 'usermail@mail.com',
                password: 'userpassword'
            });

        expect(response.body).toMatchObject({ id: 1 });
        expect(response.body).toHaveProperty('token');
        expect(jwt.verify(response.body.token, process.env.APP_KEY)).toHaveProperty('token');
        expect(response.status).toEqual(201);

        userInfo.token = response.body.token;
    });

    test('It should not be able to create more of one user with same email', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'username',
                email: 'usermail@mail.com',
                password: 'userpassword'
            });

        expect(response.status).toEqual(401);
        expect(response.body).toEqual({
            error: 'This email just has be used, choose another',
        });
    });

    test('It should to return the created user', async () => {
        const response = await request(app).get('/users');

        expect(response.body).toEqual([{
            id: 1,
            name: 'username',
            email: 'usermail@mail.com',
            whatsapp: null,
            avatar: null,
            bio: null
        }]);
    });

    test('It should be able to get an only user', async () => {
        const response = await request(app).get('/users/1');

        expect(response.body).toEqual({
            user: {
                id: 1,
                name: 'username',
                email: 'usermail@mail.com',
                whatsapp: null,
                avatar: null,
                bio: null
            }
        });
    });

    test('It should be able to update an user', async () => {
        const response = await request(app).put('/users/1')
            .set('authorization', userInfo.token)
            .send({
                name: 'username',
                email: 'usermail@mail.com',
                whatsapp: '0000000000',
                bio: 'user bio'
            });

        expect(response.status).toEqual(200);
    });

    test('It should to return the updated user', async () => {
        const response = await request(app).get('/users/1');

        expect(response.body).toEqual({
            user: {
                id: 1,
                name: 'username',
                email: 'usermail@mail.com',
                avatar: null,
                whatsapp: '0000000000',
                bio: 'user bio'
            }
        });
    });

    test('It should be able to make login', async () => {{
        const response = await request(app).post('/session').send({
            email: 'usermail@mail.com',
            password: 'userpassword'
        });

        expect(response.body).toHaveProperty('token');
        expect(jwt.verify(response.body.token, process.env.APP_KEY)).toHaveProperty('token');
        expect(response.status).toEqual(200);

        userInfo.token = response.body.token;
    }});

    test('It should be able to delete an user', async () => {
        const response = await request(app).delete('/users/1').set('authorization', userInfo.token);

        expect(response.status).toEqual(200);
    });
});
