import { celebrate, Joi } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import db from '@database/connection';

class FrameCategoryMiddlewares {
    validateBodyToCreate = celebrate({
        body: Joi.object().keys({
            keyword: Joi.string().required(),
            description: Joi.string().required(),
        }),
    });

    validateBodyToUpdate = celebrate({
        body: Joi.object().keys({
            keyword: Joi.string().required(),
            description: Joi.string().required(),
        }),
    });

    async validateUniqueKeyword(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
        const { keyword } = request.body;
        const category = await db('frames_categories').select().where('keyword', '=', keyword).first();

        if (category && category.id !== Number(id)) {
            return response.status(400).json({
                error: 'Category with this keyword just was created',
            });
        }

        if (id) {
            request.body.keyword = request.body.keyword ?? category.keyword;
            request.body.description = request.body.description ?? category.description;
        }
        if (!id && (!request.file || !request.file.filename)) {
            return response.status(400).json({
                error: 'You may have to send a image'
            });
        }

        request.body.image = request.file?.filename ?? category.image;

        return next();
    }
}

export default new FrameCategoryMiddlewares();
