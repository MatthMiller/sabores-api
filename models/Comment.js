import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import User from './User.js';

const Comment = db.define('Comment', {
  stars: {
    type: DataTypes.DECIMAL,
    required: true,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    required: true,
    allowNull: true,
  },
});

Comment.belongsTo(User);

export default Comment;
