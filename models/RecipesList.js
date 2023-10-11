import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import User from './User.js';

const RecipesList = db.define('RecipesList', {
  title: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  isSeasonal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

RecipesList.belongsTo(User);

export default RecipesList;
