const debug = require('debug')('backend:resolvers');

const login = async (_, { email, password }, context) => {
  const { dataSources: { usersAPI } } = context;

  const accessToken = await usersAPI.login({ email, password });

  return {
    email,
    accessToken,
  };
}

const resolvers = {
  Query: {
    tasks: async (_, { skip, limit }, { user, dataSources: { tasksAPI } }) => {
      if (user && !user.id) {
        throw new Error('Forbidden');
      }

      const tasks = await tasksAPI.find({ skip, limit, user_id: user.id });

      return tasks;
    },
    task: (_, { id }, { dataSources: { tasksAPI } }) => {
      if (user && !user.id) {
        throw new Error('Forbidden');
      }

      return tasksAPI.get(id);
    }
  },
  Mutation: {
    addTask: (_, { task, user_id }, { user, dataSources: { tasksAPI } }) => {
      if (user && !user.id) {
        throw new Error('Forbidden');
      }

      return tasksAPI.create({ task, user_id: user.id });
    },
    updateTask: (_, { id, newTask }, { user, dataSources: { tasksAPI } }) => {
      if (user && !user.id) {
        throw new Error('Forbidden');
      }
      return tasksAPI.patch(id, { task: newTask });
    },
    removeTask: (_, { id }, { user, dataSources: { tasksAPI } }) => {
      if (user && !user.id) {
        throw new Error('Forbidden');
      }

      return tasksAPI.patch(id, { deleted: true, deletedAt: new Date() });
    },
    signUp: async (_, { email, password }, { dataSources: { usersAPI } }) => {
      await usersAPI.create({ email, password });

      return login(_, { email, password }, { dataSources: { usersAPI } });
    },
    login,
  },
};


module.exports = resolvers;
