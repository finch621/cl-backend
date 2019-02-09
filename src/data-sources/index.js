const TasksAPI = require('./tasks.api');
const UsersAPI = require('./users.api');
const store = require('../store')();

module.exports = {
  tasksAPI: new TasksAPI({ store }),
  usersAPI: new UsersAPI({ store }),
};
