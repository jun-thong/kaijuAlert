'use strict';
/**
 * Configure winston logging module.
 *
 * @author jun
 */

let winston         = require('winston'),
    cfg             = require('config');

module.exports = function() {
    winston.remove(winston.transports.Console);
    // Add console logger only for development.
    if (cfg.get('LOG.CONSOLE')) {
        winston.add(winston.transports.Console, {
            level: 'debug',
            colorize: true,
            timestamp: true
        });
    }
};
