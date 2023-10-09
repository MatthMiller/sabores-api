import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import Recipe from './Recipe.js';

const Category = db.define('Category', {
  title: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  imageName: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
});

export default Category;
