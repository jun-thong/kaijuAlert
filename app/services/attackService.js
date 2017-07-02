'use strict';

/**
 * Attack's service.
 * Define all Attack related business logic.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let logger              = require('winston'),
    validator           = require('validator'),
    config              = require('config'),
    seqErrors           = require('../../node_modules/sequelize/lib/errors'),
    models              = require('../models/index.js');

/**
 * Get the last 10 attacks.
 *
 * @returns {Promise.<*>}
 */
module.exports.getLastAttacks = async () => {
    logger.debug('attackService.getLastAttacks()');

    // here we'll use a manual sql query for an optimized usage of postgreSQL.
    // Attacks table stores the involded kaiju's ids in an array, this way we can make an up to 5 time faster query
    // comparing to use a more classic join table. The used ORM doesn't support this functionality, causing me to forge
    // this query manually.
    // Also, using json_agg() and json_build_object() is faster and cleaner than building the same json object at
    // the application level.
    // The query could be even more optimised, but i target a MVP for this showcase.
    let query = 'SELECT a.id, json_agg(json_build_object(\'id\', k.id, \'name\', k.name, \'nameRomaji\', k."nameRomanji")) AS kaijus, a.location, a."beginAt", a."finishAt", u.nickname ' +
    'FROM "Attacks" AS a ' +
    'LEFT JOIN "Kaijus" AS k ON k.id = ANY(a.kaijus) ' +
    'LEFT JOIN "Users" AS u ON u.id = a."createdBy" ' +
    'GROUP BY a.id, u.nickname ' +
    'ORDER BY a."beginAt" DESC ' +
    'LIMIT 10';

    return await models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT });
};

/**
 * Get attack around user.
 * The radius used is set in config file using meters.
 *
 * @param {Number} lat
 * @param {Number} lon
 * @returns {Promise.<*>}
 */
module.exports.getAttackAroundUser = async (lat, lon) => {
    // Because I'll skip some sequelize sugar, i'll have to validate data manually.
    // Validator module only accept string, so i'll cast lat/lon to string just in case.
    // Also, i'll use min/max to check if it's a valid coordinate.
    if(validator.isFloat(lat + '', { min: -90, max: 90 }) || validator.isFloat(lon + '', { min: -180, max: 180 })){
        // Why create a validation error myself when sequelize come with one built in ?
        // Allow me to keep a more coherent error handling.
        // Usually i'll provide an error message from an i18n system, but i'll do without to keep this project simple.
        throw new seqErrors.ValidationError();
    }

    // @see attackService.getLastAttacks() for comment on optimization.
    // Also ORMs are not really good to query geoData...
    let query = 'SELECT a.id, json_agg(json_build_object(\'id\', k.id, \'name\', k.name, \'nameRomaji\', k."nameRomanji")) AS kaijus, a.location, a."beginAt", a."finishAt", u.nickname ' +
    'FROM "Attacks" AS a ' +
    'LEFT JOIN "Kaijus" AS k ON k.id = ANY(a.kaijus) ' +
    'LEFT JOIN "Users" AS u ON u.id = a."createdBy" ' +
    'WHERE ST_Distance_Sphere(ST_MakePoint(' + lat + ',' + lon + '), a.location) <= ' + config.get('APP.SEARCH_RADIUS') + '' +
    'GROUP BY a.id, u.nickname ' +
    'ORDER BY a."beginAt" DESC ' +
    'LIMIT 10';

    return await models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT });
};

/**
 * Create an attack.
 *
 * @param {Object} data
 * @returns {Promise.<void>}
 */
module.exports.create = async (data) => {
    await models.Attack.create({
        kaijus: data.kaijus,
        beginAt: data.beginAt,
        finishAt: data.finishAt,
        location: data.location,
        createdBy: data.createdBy
    });
};

/**
 * Delete an attack.
 *
 * @param {String} id
 * @returns {Promise.<void>}
 */
module.exports.delete = async (id) => {
    await models.Attack.destroy({where: {
        id: id
    }});
};

/**
 * Update an attack.
 *
 * @param {Object} data
 * @returns {Promise.<void>}
 */
module.exports.update = async (data) => {
    await models.Attack.update({
        kaijus: data.kaijus,
        beginAt: data.beginAt,
        finishAt: data.finishAt,
        location: data.location,
        createdBy: data.createdBy
    }, {
        where: {
            id: data.id
        }
    });
};
