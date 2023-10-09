import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import Recipe from './Recipe.js';

const RecipesList = db.define('RecipesList', {
  title: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
});

export default RecipesList;
