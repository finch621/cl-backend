const SQL = require('sequelize');

function createStore() {
  const Op = SQL.Op;
  const operatorsAliases = {
    $in: Op.in,
  };

  const db = new SQL('test', 'cltest', '12345', {
    dialect: 'mysql',
    logging: false,
    operatorsAliases,
  });

  const tasks = db.define('tasks', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    task: SQL.STRING,
    user_id: SQL.INTEGER,
    deletedAt: SQL.DATE,
    deleted: { type: SQL.BOOLEAN, defaultValue: false },
  });

  const users = db.define('users', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    email: {
      type: SQL.STRING,
      validate: { isEmail: true },
      unique: true,
    },
    password: SQL.STRING,
  });

  db.sync().then(() => console.log('tables created/synced'));

  return {
    db,
    tasks,
    users,
  };
}

module.exports = createStore;
