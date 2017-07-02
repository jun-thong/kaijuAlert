'use strict';

/**
 *
 * Define an allow Cross Origin Request middleware.
 * Mainly used in dev environment.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

/**
 * Define the middleware.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
module.exports = function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};
