const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    cars:[ModelCar]
  }
`;