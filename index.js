import 'dotenv/config';
import express from 'express';
import db from './db/db.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';
import Recipe from './models/Recipe.js';
import Rating from './models/Rating.js';
import specs from './docs/swagger.js';
import { serve, setup } from 'swagger-ui-express';
import { rateLimit } from 'express-rate-limit';

const app = express();
app.use(express.json({ limit: '8mb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes,
    limit: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);

app.use('/api-docs', serve, setup(specs));
// images/nome-imagem.jpg
app.use(express.static('static'));

app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/recipe', recipeRoutes);
app.use('/', (req, res) => {
  res.status(404).json({ message: 'Status 404: Route not found' });
});

db.sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

// Anotações:
/**
 * Apagar as outras rotas que não vai usar (post, comments)
 * e os respectivos controllers
 *
 * As imagens serão armazenadas em disco
 * no servidor com um uuid unico. (instalar lib)
 * No controller sera gerado um url
 * com o uuid da imagem.
 * Servir de public/images
 * Ver como fiz na gameon pdf
 *
 * Documentar pelo Postman (collections)
 * na opção view documentation da request
 * tem como colocar basicamente tudo.
 * Ele gera um link da api
 */
