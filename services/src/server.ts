import { ApolloServer } from "apollo-server-express";
import * as cors from "cors";
import * as express from "express"; 
const schema = require('./graphql/schema');
// import accessEnv from "#root/helpers/accessEnv";
const models = require('@base/models');

const { createContext } = require('dataloader-sequelize');
const { sequelize, isReady } = require('@base/models');
const PORT = 5000;

 const apolloServer = new ApolloServer({ schema,  context: async (params) => {
  // simple auth check on every request
  const { ctx } = params;
  const token = ctx && ctx.req ? ctx.req.headers.authorization : null;
  await isReady;
  const dataLoaderContext = createContext(sequelize);
 
  return {
    user: null,
    models,
    ctx,
    dataLoaderContext,
  };
} });

const app = express();

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
    preflightContinue: true,
    exposedHeaders: [
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept",
      "X-Password-Expired"
    ],
    optionsSuccessStatus: 200
  })
);

 apolloServer.applyMiddleware({ app, path: "/graphql" });

app.listen(PORT, () => {
  console.info(`Mawthog service listening on ${PORT}`);
});