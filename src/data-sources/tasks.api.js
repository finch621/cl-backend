const {DataSource} = require('apollo-datasource');

class TasksAPI extends DataSource {
  constructor({store}) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  find({skip, limit, user_id}) {
    return this._find({skip, limit, user_id});
  }

  _find({skip: offset = 0, limit = 10, user_id}) {
    return this.store.tasks
      .findAndCountAll({
        where: {user_id, deleted: false},
        offset,
        limit,
        order: [['updatedAt', 'DESC']],
        raw: true,
      })
      .then(result => {
        return {
          tasks: result.rows,
          count: result.count,
        };
      });
  }

  get(id) {
    return this._get(id);
  }

  _get(id) {
    return this.store.tasks
      .findOne({where: {id}})
      .then(task => task.dataValues);
  }

  create(data) {
    return this._create(data);
  }

  _create(data) {
    return this.store.tasks.create(data, {raw: true});
  }

  patch(id, data) {
    return this._patch(id, data);
  }

  _patch(id, data) {
    return this.store.tasks
      .update(data, {where: {id}})
      .then(() => this.get(id));
  }
}

module.exports = TasksAPI;
