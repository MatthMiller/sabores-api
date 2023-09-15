import { Router } from 'express';
import PostController from '../controllers/PostController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const postRoutes = Router();

postRoutes.get('/all/:order?', PostController.getAll);
postRoutes.get('/:id', PostController.getOne);
postRoutes.get('/:id/comments', PostController.comments);
postRoutes.post('/create', authMiddleware, PostController.create);
postRoutes.put('/:id/update', authMiddleware, PostController.update);
postRoutes.delete('/:id/delete', authMiddleware, PostController.delete);

export default postRoutes;
