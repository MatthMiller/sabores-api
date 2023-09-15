import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import User from './User.js';
import Comment from './Comment.js';

const Post = db.define('Post', {
  title: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    required: true,
    allowNull: false,
  },
});

Post.belongsTo(User);
Post.hasMany(Comment);

export default Post;
