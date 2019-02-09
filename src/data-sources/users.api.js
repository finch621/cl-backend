const { DataSource } = require('apollo-datasource');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsersAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  create(data) {
    return this._create(data);
  }

  async _create({ email, password }) {
    if (password.length < 6) {
      throw new Error('password must be at least six characters');
    }

    const hashedPassword = await this._hashPassword(password);

    return this.store.users.create({ email, password: hashedPassword }, { raw: true });
  }

  _get(email) {
    return this.store.users.findOne({ where: { email } })
      .then(user => user && user.dataValues ? user.dataValues : null);
  }

  _hashPassword(password) {
    const BCRYPT_WORK_FACTOR_BASE = 12;
    const BCRYPT_DATE_BASE = 1483228800000;
    const BCRYPT_WORK_INCREASE_INTERVAL = 47300000000;

    return new Promise((resolve, reject) => {
      let BCRYPT_CURRENT_DATE = new Date().getTime();
      let BCRYPT_WORK_INCREASE = Math.max(0, Math.floor((BCRYPT_CURRENT_DATE - BCRYPT_DATE_BASE) / BCRYPT_WORK_INCREASE_INTERVAL));
      let BCRYPT_WORK_FACTOR = Math.min(19, BCRYPT_WORK_FACTOR_BASE + BCRYPT_WORK_INCREASE);

      bcrypt.genSalt(BCRYPT_WORK_FACTOR, function (error, salt) {
        if (error) {
          return reject(error);
        }

        bcrypt.hash(password, salt, function (error, hashedPassword) {
          if (error) {
            return reject(error);
          }

          resolve(hashedPassword);
        });
      });
    });
  }

  async login({ email, password }) {
    const user = await this._get(email);

    if (!user) {
      throw new Error('Check your email or password');
    }

    const passwordSuccess = await this._comparePassword(password, user.password);

    if (!passwordSuccess) {
      throw new Error('Check your email or password');
    }

    return this._getJWTToken({ id: user.id, email: user.email });
  }


  async _comparePassword(password, savedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, savedPassword, function(error, result) {
        if (error) return reject(error);

        return resolve(result);
      });
    });
  }

  _getJWTToken(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, 'secret', {}, function(error, token) {
        if (error) return reject(error);

        return resolve(token);
      });
    });
  }

  verifyJWT(accessToken) {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, 'secret', {}, function(error, payload) {
        if (error) return reject(error);

        return resolve(payload);
      });
    });
  }
}

module.exports = UsersAPI;
