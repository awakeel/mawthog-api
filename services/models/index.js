
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const models = {}; 
const sequelizeTransforms = require('sequelize-transforms');
const sequelizePaginate = require('sequelize-paginate');
const { gql } = require('apollo-server');
const convert = require('@base/lib/sequelize-to-gql');
const gqlTypes = {};
 
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../sequelize/config.js')[env];
const db = {};

let sequelize;
 
  sequelize = new Sequelize(config.database, config.username, config.password, config);
 

models.isReady = new Promise((resolve) => {
  fs.readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1)
    .forEach((file) => {
      const model = sequelize.import(path.join(__dirname, file));
      sequelizeTransforms(model);
      //sequelizePaginate.paginate(model);
      models[model.name] = model;

      // graph graphQL schema type that prefix with 'Model' and also input that prefix with 'Input'
      gqlTypes[model.name] = gql`
        type Model${model.name} {
          ${convert(model)}
        }

        input Input${model.name} {
          ${convert(model, { allowNull: true })}
        }
      `;
    });

  // load models in the schema
  const schemaDefinitions = [
    // {
    //   dirname: 'property-records',
    //   modelPrefix: 'PropertyRecords_',
    // },
    // {
    //   dirname: 'crawlers',
    //   modelPrefix: 'Crawlers_',
    // },
  ];

  // schemaDefinitions.forEach((definiton) => {
  //   fs.readdirSync(path.join(__dirname, definiton.dirname))
  //     .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1)
  //     .forEach((file) => {
  //       const model = sequelize.import(path.join(__dirname, definiton.dirname, file));
  //       sequelizeTransforms(model);
  //       // models[definiton.modelPrefix] = models[definiton.modelPrefix] || {};
  //       models[`${definiton.modelPrefix}${model.name}`] = model;

  //       // graph graphQL schema type that prefix with 'Model'
  //       gqlTypes[`${definiton.modelPrefix}${model.name}`] = gql`
  //       type ${definiton.modelPrefix}Model${model.name} {
  //         ${convert(model)}
  //       }
  //     `;
  //     });
  // });

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  }); 
  resolve(true);
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.gqlTypes = gqlTypes;
models.Op = Sequelize.Op;

module.exports = models;

