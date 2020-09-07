import { Router } from 'express';

import PingController from '@controllers/PingController';
import UserController from '@controllers/UserController';

const routes = Router();

routes.get('/ping', PingController.index);

routes.get('/users', UserController.index);
routes.post('/users', UserController.create);
routes.get('/users/:id', UserController.show);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.destroy);

export default routes;
