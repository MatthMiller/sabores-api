import { Router } from 'express';
import express from 'express';
import RecipesListController from '../controllers/RecipesListController.js';

const recipesListRoutes = Router();

recipesListRoutes.post('/create', RecipesListController.create);
recipesListRoutes.post('/addToList', RecipesListController.addToList);
recipesListRoutes.delete(
  '/removeFromList',
  RecipesListController.removeFromList
);
recipesListRoutes.put(
  '/setSeasonalList/:listId',
  RecipesListController.setSeasonalList
);
recipesListRoutes.get(
  '/getSeasonalList',
  RecipesListController.getSeasonalList
);

export default recipesListRoutes;
