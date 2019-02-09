const {ApolloServer} = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const APIs = require('./data-sources');
const { usersAPI } = APIs;

const dataSources = () => (APIs);

const context = async ({ req }) => {
  const accessToken = req.headers.authorization || '';

  if (accessToken) {
    const payload = await usersAPI.verifyJWT(accessToken);

    return { user: payload };
  }

  return { user: {} };
}

const server = new ApolloServer({
  context,
  typeDefs,
  resolvers,
  dataSources,
});

if (process.env.NODE_ENV !== 'test') {
  server
    .listen()
    .then(({url}) => console.log(`Server ready at ${url}`));
}

module.exports = server;
