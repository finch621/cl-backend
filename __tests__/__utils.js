const {HttpLink} = require('apollo-link-http');
const fetch = require('node-fetch');
const {execute, toPromise} = require('apollo-link');
const {ApolloServer} = require('apollo-server');

module.exports.toPromise = toPromise;

const server = require('../src');
const typeDefs = require('../src/schema');
const resolvers = require('../src/resolvers');
const store = require('../src/store')();

const {
  TasksAPI
} = require('../src/data-sources');

/**
 * Integration testing utils
 */
const defaultContext = () => ({user: {id: 1, email: 'test@test.com'}});
const constructTestServer = ({context = defaultContext} = {}) => {
  const tasksAPI = new TasksAPI({ store });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      tasksAPI,
    }),
    context,
  });

  return {server, tasksAPI, store};
};

module.exports.constructTestServer = constructTestServer;

/**
 * e2e Testing Utils
 */

const startTestServer = async server => {
  // if using apollo-server-express...
  // const app = express();
  // server.applyMiddleware({ app });
  // const httpServer = await app.listen(0);

  const httpServer = await server.listen({port: 0});

  const link = new HttpLink({
    uri: `http://localhost:${httpServer.port}`,
    fetch,
  });

  const executeOperation = ({query, variables = {}}) =>
    execute(link, {query, variables});

  return {
    link,
    stop: () => httpServer.server.close(),
    graphql: executeOperation,
  };
};

module.exports.startTestServer = startTestServer;
