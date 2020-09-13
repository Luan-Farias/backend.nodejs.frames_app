import { celebrate, Joi } from 'celebrate';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '@database/connection';

class UserMiddlewares {
    validateBodyToCreate = celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    });


    validateBodyToUpdate = celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string(),
            whatsapp: Joi.string(),
            bio: Joi.string(),
        }),
    });

    validateBodyToLogin = celebrate({
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
    });

    async validateUniqueEmail(request: Request, response: Response, next: NextFunction) {
        const { email } = request.body;

        const user = await db('users').where('email', email).first();

        if (!user) return next();

        const { id } = request.params;

        if(!id || user.id !== Number(id)) {
            return response.status(401).json({
                error: 'This email just has be used, choose another',
            });
        }

        return next();
    }

    async validateToUsersRoute(request: Request, response: Response, next: NextFunction) {
        const { user } = request.body;
        const { id } = request.params;

        if (user.id !== Number(id)) {
            return response.status(401).json({
                error: 'You\'re not authorizated to make this process'
            });
        }

        return next();
    }

    async replaceInvalidFields(request: Request, response: Response, next: NextFunction) {
        const { user, name, email, password, whatsapp, bio } = request.body;

        request.body.name = name;
        request.body.email = email;
        request.body.password = password ? await bcrypt.hash(password, 8) : user.password;
        request.body.whatsapp = whatsapp ?? user.whatsapp;
        request.body.avatar = request.file?.filename ?? user.avatar;
        request.body.bio = bio ?? user.bio;

        next();
    }

    async validateToken(request: Request, response: Response, next: NextFunction) {
        const { authorization } = request.headers;

        if (!authorization) {
            return response.status(401).json({
                error: 'Not send the authorization token'
            });
        }

        const payload= jwt.verify(authorization, process.env.APP_KEY);

        const user = await db('users').where('token', Object(payload).token).first();

        if(!user) {
            return response.status(404).json({
                error: 'Token not valid!',
            });
        }

        request.body.user = user;
        return next();
    }
}

export default new UserMiddlewares();
