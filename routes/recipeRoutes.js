import { Router } from 'express';
import RecipeController from '../controllers/RecipeController.js';
import imageSavingMiddleware from '../middlewares/imageSavingMiddleware.js';

const recipeRoutes = Router();

recipeRoutes.post('/create', imageSavingMiddleware, RecipeController.create);
recipeRoutes.get('/feed/:order?', RecipeController.feed);
recipeRoutes.get('/:id', RecipeController.show);

export default recipeRoutes;
