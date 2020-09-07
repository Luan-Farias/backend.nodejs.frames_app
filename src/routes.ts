import { Router } from 'express';
import multer from 'multer';

import PingController from '@controllers/PingController';
import UserController from '@controllers/UserController';
import UserMiddlewares from '@middlewares/UserMiddlewares';
import multerConfig from '@config/multerConfig';
import SessionController from '@controllers/SessionController';

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
    UserMiddlewares.replaceInvalidFields,
    UserController.update,
);
routes.delete(
    '/users/:id',
    UserMiddlewares.validateToken,
    UserController.destroy
);

export default routes;
