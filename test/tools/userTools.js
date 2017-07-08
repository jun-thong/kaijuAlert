'use strict';
/**
 * User tools
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let models      = require('../../app/models');

let user;

/**
 * Return a test user. Keep it in "cache" for later use.
 *
 * @returns {Promise.<*>||Object}
 */
module.exports.getUser = async () => {
    if(!user) {
        return await models.User.findById('00000000-0000-0000-0000-000000000000', {raw: true});
    }else{
        return user;
    }
};
