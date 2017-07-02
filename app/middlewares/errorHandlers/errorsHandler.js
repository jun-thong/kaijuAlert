'use strict';

/**
 * Define an error handling middleware for www request.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let logger          = require('winston');

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

    (err.httpError) ? res.status(err.httpError) : res.status(500);
    (err.httpError) ? res.render(err.httpError) : res.render('errors/500', { err: err });
};

/**
 * Error handler wrapper for async/await use in express.
 *
 * @param {Function} fn
 */
module.exports.wrapper = fn => (...args) => fn(...args).catch(args[2]);
