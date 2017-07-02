'use strict';
/**
 * Sequelize wrapper for Express.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let fs          = require('fs'),
    path        = require('path'),
    logger      = require('winston'),
    Sequelize   = require('sequelize'),
    cfg         = require('config');

/*  =============================================================================
    Configure models
    ============================================================================= */
let sequelize = new Sequelize(cfg.get('SQL.DB'), cfg.get('SQL.USER'), cfg.get('SQL.PASSWD'), {
        dialect: 'postgres',
        host: cfg.get('SQL.HOST'),
        port: cfg.get('SQL.PORT'),
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }),
    db        = {};

fs
    .readdirSync(path.join(__dirname))
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file){
        let model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/*  =============================================================================
    Configure associations
    ============================================================================= */
/* db.Subscription.belongsTo(db.User, { as: 'followr', foreignKey: 'follower', targetKey: 'id' });
db.Subscription.belongsTo(db.User, { as: 'followd', foreignKey: 'followed', targetKey: 'id' }); */

// Only required if model association is planned.
/* Object.keys(db).forEach(function(modelName){
    if('associate' in db[modelName]) db[modelName].associate(db);
}); */

/**
 * Exports sequelize object with all models.
 *
 * @type {{}}
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} User
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Kaiju
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Attack
 */
module.exports = db;
