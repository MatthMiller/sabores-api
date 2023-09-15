import { DataTypes } from 'sequelize';
import db from '../db/db.js';

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
});

export default User;
