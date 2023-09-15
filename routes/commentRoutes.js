import { Router } from 'express';
import CommentController from '../controllers/CommentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const commentRoutes = Router();

commentRoutes.get('/:id', CommentController.getOne);
commentRoutes.post(
  '/create/:postId',
  authMiddleware,
  // bind is necessary for '.this' context
  // (to use callback of another method)
  CommentController.create.bind(CommentController)
);
commentRoutes.put(
  '/update/:id',
  authMiddleware,
  CommentController.update.bind(CommentController)
);
commentRoutes.delete('/delete/:id', authMiddleware, CommentController.delete);

export default commentRoutes;
