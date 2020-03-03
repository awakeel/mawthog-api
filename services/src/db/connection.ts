import {Sequelize} from 'sequelize-typescript';
const sequelize = new Sequelize('mawthog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });

export default sequelize;