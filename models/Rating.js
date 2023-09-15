import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import User from './User.js';
import Recipe from './Recipe.js';

const Rating = db.define('Rating', {
  stars: {
    type: DataTypes.FLOAT,
    required: false,
    allowNull: true,
  },
  comment: {
    type: DataTypes.STRING,
    required: false,
    allowNull: true,
  },
  isSaved: {
    type: DataTypes.BOOLEAN,
    required: true,
    allowNull: false,
  },
});

Rating.belongsTo(User);

export default Rating;
