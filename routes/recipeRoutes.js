import { Router } from 'express';
import RecipeController from '../controllers/RecipeController.js';
import imageSavingMiddleware from '../middlewares/imageSavingMiddleware.js';
import express from 'express';

const recipeRoutes = Router();

recipeRoutes.post('/create', imageSavingMiddleware, RecipeController.create);
recipeRoutes.get('/feed/:order?', RecipeController.feed);

export default recipeRoutes;
