'use strict';
/**
 * A kaiju's model.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

module.exports = function(sequelize, types) {
    return sequelize.define('Kaiju', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        name: { type: types.STRING, allowNull: false },
        nameRomanji: { type: types.STRING, allowNull: false }
    });
};
