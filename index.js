import 'dotenv/config';
import express from 'express';
import db from './db/db.js';
import userRoutes from './routes/userRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import Follow from './models/Follow.js';
import User from './models/User.js';
import Recipe from './models/Recipe.js';
import Category from './models/Category.js';
import RecipesList from './models/RecipesList.js';
import Rating from './models/Rating.js';
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

// images/nome-imagem.ext
app.use(express.static('static'));

app.use('/user', userRoutes);
app.use('/recipe', recipeRoutes);
app.use('/', (req, res) => {
  res.status(404).json({ message: 'Status 404: Route not found' });
});

// { force: true } apaga tudo
db.sync()
  .then(() => {
    app.listen(3030);
  })
  .catch((err) => {
    console.log(err);
  });
