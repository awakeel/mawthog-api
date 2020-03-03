const { gql } = require('apollo-server');

module.exports = gql`
  extend type ModelUser {
    cars:[ModelCar]
  }

  extend type Query {
    users:[ModelUser]
  }
`;
