import { Request, Response } from 'express';
import db from '@database/connection';

class FramesController {
    async index(request: Request, response: Response) {
        const { page = 0, perPage = 12} = request.query;

        const frames = await db('frames')
            .join('users', 'frames.id_user', '=', 'users.id')
            .join('frames_categories', 'frames.id_category', '=', 'frames_categories.id')
            .select(
                [
                    'frames.*',
                    'users.name', 'users.email', 'users.whatsapp', 'users.avatar', 'users.bio',
                    'frames_categories.keyword', 'frames_categories.description as frame_description', 'frames_categories.image'
                ]
            ).limit(Number(perPage)).offset(Number(page));

        return response.json(frames);
    }

    async create(request: Request, response: Response) {
        const {
            id_user, id_category, description, image, selling, qt, price
        } = request.body;

        const frame = {
            id_user,
            id_category,
            description,
            image,
            selling,
            qt,
            price
        };

        await db('frames').insert(frame);

        return response.status(201).send();
    }

    async show (request: Request, response: Response) {
        const { id } = request.params;

        const frames = await db('frames')
            .where('frames.id', '=', id)
            .join('users', 'frames.id_user', '=', 'users.id')
            .join('frames_categories', 'frames.id_category', '=', 'frames_categories.id')
            .select(
                [
                    'frames.*',
                    'users.name', 'users.email', 'users.whatsapp', 'users.avatar', 'users.bio',
                    'frames_categories.keyword', 'frames_categories.description as frame_description', 'frames_categories.image'
                ]
            ).first();

        return response.json(frames);
    }

    async filterByUser (request: Request, response: Response) {
        const { id } = request.params;

        const frames = await db('frames')
            .where('users.id', '=', id)
            .join('users', 'frames.id_user', '=', 'users.id')
            .join('frames_categories', 'frames.id_category', '=', 'frames_categories.id')
            .select(
                [
                    'frames.*',
                    'users.name', 'users.email', 'users.whatsapp', 'users.avatar', 'users.bio',
                    'frames_categories.keyword', 'frames_categories.description as frame_description', 'frames_categories.image'
                ]
            );

        return response.json(frames);
    }

    async update(request: Request, response: Response) {
        const {
            id_category, description, image, selling, qt, price
        } = request.body;

        const frame = {
            id_category,
            description,
            image,
            selling,
            qt,
            price
        };

        await db('frames').update(frame).where('id', request.params.id);

        return response.send();
    }

    async delete (request: Request, response: Response) {
        await db('frames').delete().where('id', request.params.id);

        return response.send();
    }
}

export default new FramesController();
