import { Router } from 'express';
import CategoryController from '../controllers/CategoryController.js';
import express from 'express';
import imageSavingMiddleware from '../middlewares/imageSavingMiddleware.js';

const categoryRoutes = Router();

categoryRoutes.post(
  '/create',
  imageSavingMiddleware,
  CategoryController.create
);
categoryRoutes.get('/all', CategoryController.getAll);

export default categoryRoutes;
