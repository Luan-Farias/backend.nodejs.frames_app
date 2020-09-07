import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db from '@database/connection';

class SessionController {
    async store(request: Request, response: Response) {
        const { email, password } = request.body;

        const user = await db('users').select().where('email', email).first();

        if(!user) {
            return response.status(404).json({
                error: 'User not found',
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) return response.status(401).json({
            error: 'Email and/or password are wrong',
        });

        const token = await bcrypt.hash(crypto.randomBytes(4).toString(), 8);

        await db('users').update({
            token: token
        }).where('id', user.id);

        return response.json({
            token: jwt.sign({
                token,
            }, process.env.APP_KEY, {
                expiresIn: '7d',
            }),
        });
    }
}

export default new SessionController();
