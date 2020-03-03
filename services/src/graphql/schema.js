const allTypes = require('./typedefs');
const allResolvers = require('./resolvers');
const { makeExecutableSchema } = require('graphql-tools');
const { gql } = require('apollo-server');
const  {gqlTypes}  = require('@base/models');
const GraphQLJSON = require('graphql-type-json');
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');

const RootQuery = gql`
  # Put fake fields on each Query & Mutation as below because currently schema cannot have empty type
  # If you had Query & Mutation fields not associated with a specific type you could put them here
  type Query {
    _empty: String
  }
  type Mutation {
    null: Boolean
  }
  type Subscription {
    _empty: String
  }

  # Default pagination PageInfo type
#type PageInfo {
#endCursor: String
#    hasNextPage: Boolean!
#    hasPreviousPage: Boolean!
#    startCursor: String
#}

   input InputPagination {
    limit: Int!
     offset: Int!
    }
 
    interface Node {
     id: ID!
      createdAt: DateTime!
     updatedAt: DateTime
    }
`;

const RootSchemaDefinition = gql`
  scalar JSON
  scalar Date
  scalar Time
  scalar DateTime
  scalar Upload

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const RootResolvers = {
  JSON: GraphQLJSON,
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
};
 
module.exports = makeExecutableSchema({
  typeDefs: [RootSchemaDefinition, RootQuery].concat(Object.values(gqlTypes)).concat(Object.values(allTypes.types)),
  resolvers: [RootResolvers].concat(Object.values(allResolvers.resolvers)),
  uploads: {
    // Limits here should be stricter than config for surrounding
    // infrastructure such as Nginx so errors can be handled elegantly by
    // graphql-upload:
    // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
    maxFileSize: 20000000, // 20 MB
    maxFiles: 20,
  },
});
