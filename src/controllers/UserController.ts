import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '@database/connection';

class UserController {
    async index(request: Request, response: Response) {
        try {
            const users = await db('users').select(['id', 'name', 'email', 'whatsapp', 'avatar', 'bio']);

            return response.json(users);
        } catch (error) {
            return response.json({ error });
        }
    }

    async create(request: Request, response: Response) {
        const { name, email, password } = request.body;

        const user = {
            name,
            email,
            password: await bcrypt.hash(password, 8),
            token: await bcrypt.hash(crypto.randomBytes(4).toString(), 8),
        };

        try {
            const insetedUsers = await db('users').insert(user, ['id']);

            return response.status(201).json({
                id: insetedUsers[0].id,
                token: jwt.sign({ token: user.token }, process.env.APP_KEY, {
                    expiresIn: '7d',
                }),
            });
        } catch (error) {
            return response.status(500).json({ error });
        }
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const { authorization } = request.headers;

        const payload = {
            token: '',
        };

        if (authorization) {
            payload.token = Object(jwt.verify(authorization, process.env.APP_KEY)).token;
        }

        try {
            const user = await db('users').select(['id', 'name', 'email', 'whatsapp', 'avatar', 'bio']).where('id', id).orWhere('token', Object(payload).token).first();

            return response.json({ user: user });
        } catch (error) {
            return response.json({ error: 'Ocorreu um erro na conexão com o banco de dados, por favor tente novamente'});
        }
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { name, email, password, whatsapp, avatar, bio } = request.body;

        const user = {
            name,
            email,
            password,
            whatsapp,
            avatar,
            bio
        };

        await db('users').update(user).where('id', id);

        return response.send();
    }

    async destroy(request: Request, response: Response) {
        const { id } = request.params;

        await db('users').delete().where('id', id);
        return response.send();
    }
}

export default new UserController;
