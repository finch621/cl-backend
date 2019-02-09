const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type Task {
    id: ID!
    task: String!
    createdAt: Date!
    updatedAt: Date
    deletedAt: Date
    deleted: Boolean
    user_id: ID!
  }

  type Tasks {
    count: Int
    tasks: [Task]!
  }

  type currentUser {
    email: String
    accessToken: String!
  }

  type Query {
    task(id: ID!): Task
    tasks(skip: Int, limit: Int): Tasks!
  }

  type Mutation {
    addTask(task: String!, user_id: ID): Task!
    updateTask(id: ID!, newTask: String!): Task!
    removeTask(id: ID!): Task!
    signUp(email: String!, password: String!): currentUser!
    login(email: String!, password: String!): currentUser!
  }
`;

module.exports = typeDefs;
