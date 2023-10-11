import { DataTypes } from 'sequelize';
import db from '../../db/db.js';

const RecipesInList = db.define('RecipesInList', {
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    required: true,
  },
  recipesListId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    required: true,
  },
});

export default RecipesInList;
