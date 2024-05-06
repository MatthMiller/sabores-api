import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import ip from 'ip';
import db from './db/db.js';
import categoryRoutes from './routes/categoryRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import recipesListRoutes from './routes/recipesListRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
// Para não dar problema de cors no desenvolvimento
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(express.json({ limit: '8mb' }));
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes,
    limit: 200, // Limit each IP to 200 requests per `window`
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);

// images/nome-imagem.ext
app.use(express.static('static'));

app.use('/users', userRoutes);
app.use('/recipes', recipeRoutes);
app.use('/recipes-list', recipesListRoutes);
app.use('/categories', categoryRoutes);
app.use('/', (req, res) => {
  res.status(404).json({ message: 'Status 404: Route not found' });
});

// { force: true } apaga tudo

const ipLocal = ip.address();
db.sync()
  .then(() => {
    app.listen(3030, ipLocal);
    console.log(`Server is running at http://${ipLocal}:3030`);
  })
  .catch((err) => {
    console.log(err);
  });
