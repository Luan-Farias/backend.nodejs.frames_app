import { NextFunction, Request, Response } from 'express';
import db from '@database/connection';

class FrameMiddleware {

    async validateCategory(request: Request, response: Response, next: NextFunction) {
        const { id_category } = request.body;

        const category = await db('frames_categories').where('id', '=', id_category);

        if (!category) return response.status(404).json({
            error: 'Category not found',
        });

        return next();
    }

    replaceFieldsToCreate(request: Request, response: Response, next: NextFunction) {
        const {
            id_category, description, selling, qt, price
        } = request.body;


        if (!id_category || !description || !selling) return response.status(400).json({
            error: 'you need do send all params'
        });

        if(Number(selling) === 1 && (!qt || !price)) {
            return response.status(400).json({
                error: 'To selling a frame you have to provide a qt and a price'
            });
        }

        if(!request.file || !request.file.filename) return response.status(400).json({
            error:  'You need to send a image'
        });

        request.body.image = request.file.filename;
        request.body.id_user = request.body.user.id;

        next();
    }

    async validateFrameToUpdate (request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        const frame = await db('frames').where('id', '=', id).first();

        if(!frame) return response.status(404).json({
            error: 'No frame was found with this id',
        });

        if(frame.id_user !== Number(request.body.user.id)) return response.status(401).json({
            error: 'You are not owner of this frame'
        });

        request.body.frame = frame;

        next();
    }

    replaceFieldsToUpdate(request: Request, response: Response, next: NextFunction) {
        const {
            id_category, description, selling, qt, price, frame
        } = request.body;


        if (!id_category || !description || !selling) return response.status(400).json({
            error: 'you need do send all params'
        });

        if(Number(selling) === 1 && (!qt || !price)) {
            return response.status(400).json({
                error: 'To selling a frame you have to provide a qt and a price'
            });
        }

        request.body.image = request.file.filename ?? frame.image;
        request.body.description = description ?? frame.description;
        request.body.selling = selling ?? frame.description;
        request.body.qt = qt ?? frame.qt;
        request.body.price = price ?? frame.price;

        next();
    }

    async verifyUserToDelete(request: Request, response: Response, next: NextFunction) {
        const frame = await db('frames')
            .where('id', '=', request.params.id).first();

        if(!frame) return response.status(404).json({
            error: 'No frame found with this id'
        });

        if(Number(frame.id_user) !== Number(request.body.user.id)) return response.status(401).json({
            error: 'You are not ownerof the store'
        });

        return next();
    }
}

export default new FrameMiddleware();
