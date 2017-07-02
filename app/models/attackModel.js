'use strict';
/**
 * An attack's model.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

module.exports = function(sequelize, types) {
    return sequelize.define('Attack', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        kaijus: { type: types.ARRAY(types.UUID), allowNull: false },
        beginAt: { type: types.DATE, defaultValue: types.NOW, allowNull: false },
        finishAt: { type: types.DATE, defaultValue: types.NOW, allowNull: false },
        location: { type: types.GEOMETRY, allowNull: false },
        createdBy: { type: types.UUID, allowNull: false }
    });
};
