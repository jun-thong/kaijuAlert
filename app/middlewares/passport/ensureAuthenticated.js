'use strict';

/**
 * Passport ensure auth configurations.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let moment          = require('moment'),
    models          = require('../../models/index.js');

module.exports = function(req, res, next) {
    if (req.isAuthenticated()){
        // Fire and forget.
        models.User.update({ lastOnline: moment().valueOf() }, {
            where: {
                id: req.user.id
            }
        });
        return next();
    }
    res.redirect('/');
};
