import {Router} from 'express';

import { isLoggedOut } from '../middlewares/authentication';
import { handleLogin, handleLogout } from '../controllers/authenticationController';

const authenticationRouter = Router();

//POST: /auth/login -> login the user
authenticationRouter.post('/login', isLoggedOut, handleLogin)

//POST: /auth/logout -> logout the user
authenticationRouter.post('/logout', handleLogout)

export default authenticationRouter
