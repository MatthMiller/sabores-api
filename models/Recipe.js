import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import Rating from './Rating.js';
import User from './User.js';

const Recipe = db.define('Recipe', {
  title: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  imageUUID: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  videoLink: {
    type: DataTypes.STRING,
    required: false,
    allowNull: true,
  },
  ingredients: {
    type: DataTypes.INTEGER,
    required: true,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    required: true,
    allowNull: false,
  },
});

Recipe.belongsTo(User);
Recipe.hasMany(Rating);

export default Recipe;
