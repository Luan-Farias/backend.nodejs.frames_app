import { Router } from 'express';
import multer from 'multer';

import PingController from '@controllers/PingController';
import UserController from '@controllers/UserController';
import UserMiddlewares from '@middlewares/UserMiddlewares';
import multerConfig from '@config/multerConfig';
import SessionController from '@controllers/SessionController';
import FramesCategoryController from '@controllers/FramesCategoryController';
import FrameCategoryMiddlewares from '@middlewares/FrameCategoryMiddlewares';
import FramesController from '@controllers/FramesController';
import FrameMiddleware from '@middlewares/FrameMiddleware';

const routes = Router();
const upload =  multer(multerConfig);

routes.get('/ping', PingController.index);

routes.post(
    '/session',
    UserMiddlewares.validateBodyToLogin,
    SessionController.store,
);

routes.get('/users', UserController.index);
routes.post(
    '/users',
    UserMiddlewares.validateBodyToCreate,
    UserMiddlewares.validateUniqueEmail,
    UserController.create
);
routes.get('/users/:id', UserController.show);
routes.put(
    '/users/:id',
    upload.single('avatar'),
    UserMiddlewares.validateBodyToUpdate,
    UserMiddlewares.validateUniqueEmail,
    UserMiddlewares.validateToken,
    UserMiddlewares.validateToUsersRoute,
    UserMiddlewares.replaceInvalidFields,
    UserController.update,
);
routes.delete(
    '/users/:id',
    UserMiddlewares.validateToken,
    UserMiddlewares.validateToUsersRoute,
    UserController.destroy
);

routes.get('/categories', FramesCategoryController.index);
routes.post(
    '/categories',
    upload.single('image'),
    FrameCategoryMiddlewares.validateBodyToCreate,
    FrameCategoryMiddlewares.validateUniqueKeyword,
    FramesCategoryController.create
);
routes.get('/categories/:id', FramesCategoryController.show);
routes.put(
    '/categories/:id',
    upload.single('image'),
    FrameCategoryMiddlewares.validateBodyToUpdate,
    FrameCategoryMiddlewares.validateUniqueKeyword,
    FramesCategoryController.update,
);
routes.delete(
    '/categories/:id',
    FramesCategoryController.delete,
);

routes.get('/frames', FramesController.index);
routes.get('/frames/users/:id', FramesController.filterByUser);
routes.get('/frames/:id', FramesController.show);
routes.post(
    '/frames',
    upload.single('image'),
    UserMiddlewares.validateToken,
    FrameMiddleware.validateCategory,
    FrameMiddleware.replaceFieldsToCreate,
    FramesController.create
);
routes.put(
    '/frames/:id',
    upload.single('image'),
    UserMiddlewares.validateToken,
    FrameMiddleware.validateCategory,
    FrameMiddleware.validateFrameToUpdate,
    FramesController.update
);
routes.delete(
    '/frames/:id',
    UserMiddlewares.validateToken,
    FrameMiddleware.verifyUserToDelete,
    FramesController.delete,
);

export default routes;
