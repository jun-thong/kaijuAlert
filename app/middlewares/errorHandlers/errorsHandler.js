'use strict';

/**
 * Define an error handling middleware for www request.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let logger          = require('winston'),
    seqErrors           = require('../../../node_modules/sequelize/lib/errors');

/**
 * Express error handler
 *
 * @param {Object} err
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
module.exports.errorHandler = async (err, req, res, next) => {
    logger.debug('errorsHandler.();');
    // TODO implement in better way, with login feature, and auto detect expected answer (html / json).
    if(err){
        logger.error('============================================================================= ERROR');
        logger.error(err);
    }

    let status;

    switch(err.constructor.name){
        case 'ValidationError' :
            status = 403;
            break;
        default:
            status = 500;
            break;
    }

    res.status(status);
    res.json({ error: err });
};

/**
 * Error handler wrapper for async/await use in express.
 *
 * @param {Function} fn
 */
module.exports.wrapper = fn => (...args) => fn(...args).catch(args[2]);
