'use strict';
/**
 * A user's model.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

// dependencies
let bcrypt      = require('bcrypt'),
    logger      = require('winston');

const SALT_WORK_FACTOR = 10;

/**
 * Exports the  user's model.
 *
 * @param {Object} sequelize
 * @param {Object} types
 * @returns {*|Sequelize.Model|Model}
 */
module.exports = function(sequelize, types) {
    let User = sequelize.define('User', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        nickname: { type: types.STRING(32), allowNull: false },
        password: { type: types.STRING(128), allowNull: false },
        token: { type: types.STRING, allowNull: false }
    }, {
        indexes: [
            { name: 'nickname', fields: ['nickname'], type: 'UNIQUE' },
            { name: 'token', field: ['token'], type: 'index' }
        ],
        hooks: {
            beforeCreate: _hashPassword,
            beforeUpdate: _hashPassword
        }
    });

    User.prototype.comparePassword = _comparePassword;
    return User;
};

/**
 * Hash password. Use
 *
 * @param {Object} user
 * @param {Object} options
 * @param {Function} next
 * @returns {*}
 * @private
 */
let _hashPassword =  (user, options, next) => {
    return new Promise((resolve, reject) => {
        if (!user.password || !user.changed('password')) return resolve(user);
        bcrypt.hash(user.password, SALT_WORK_FACTOR).then((hash) => {
            user.password = hash;
            resolve(user);
        }).catch(reject);
    });
};

/**
 * Compare clear password with hashed stored password.
 *
 * @param {String}   candidatePassword as a string
 * @param {Function} next callback
 */
let _comparePassword = function(candidatePassword, next){
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return next(err);
        next(null, isMatch);
    });
};
