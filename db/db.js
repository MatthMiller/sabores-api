import { Sequelize } from 'sequelize';

const db = new Sequelize('restful_blog', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
