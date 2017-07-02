'use strict';
/**
 * Configure winston logging module.
 *
 * @author jun
 */

let winston         = require('winston'),
    cfg             = require('config');

module.exports = function() {
    // Add console logger only for development.
    if (cfg.get('LOG.CONSOLE')) {
        winston.remove(winston.transports.Console);

        winston.add(winston.transports.Console, {
            level: 'debug',
            colorize: true,
            timestamp: true
        });
    }
};
