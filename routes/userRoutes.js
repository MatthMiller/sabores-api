import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const userRoutes = Router();

userRoutes.post('/register', UserController.register);
userRoutes.post('/login', UserController.login);
userRoutes.post('/check-auth', UserController.checkAuth);
userRoutes.get('/all', UserController.getAll);
userRoutes.get('/profile', authMiddleware, UserController.profile);

export default userRoutes;

// implementar getRecipes() que o express permite

// Consultar todos os usuários registrados
// Usuários e seus posts (título e id)
