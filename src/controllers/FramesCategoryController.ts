import db from '@database/connection';
import { Response, Request } from 'express';

class FramesCategoryController {
    async index(request: Request, response: Response): Promise<Response> {
        const categories = await db('frames_categories').select().orderBy('id', 'desc');

        return response.json(categories);
    }

    async create(request: Request, response: Response) {
        const { keyword, description, image } = request.body;

        const category = {
            keyword,
            description,
            image
        };

        await db('frames_categories').insert(category);

        return response.status(201).send();
    }

    // async show(request: Request, response: Response) {

    // }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { keyword, description, image } = request.body;

        const category = {
            keyword,
            description,
            image,
        };

        await db('frames_categories').update(category).where('id', '=', id);

        return response.json(category);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        await db('frames_categories').delete().where('id', '=', id);

        return response.send();
    }
}

export default new FramesCategoryController();
