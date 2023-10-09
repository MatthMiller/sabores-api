import { DataTypes } from 'sequelize';
import db from '../db/db.js';

const Follow = db.define('Follow', {
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Follow;
