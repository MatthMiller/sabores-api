import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import Follow from './Follow.js';

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  profilePictureName: {
    type: DataTypes.STRING,
    required: false,
    allowNull: true,
  },
});

User.belongsToMany(User, {
  as: 'followers',
  through: Follow,
  foreignKey: 'followingId',
});

User.belongsToMany(User, {
  as: 'following',
  through: Follow,
  foreignKey: 'followerId',
});

export default User;
