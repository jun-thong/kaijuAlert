'use strict';
/**
 * Define auth related controllers.
 * For the sake of simplicity, and always keeping the same token, i won't use double token auth, token deserialization,
 * refresh token, or any other strong token auth.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let passport        = require('passport'),
    logger          = require('winston');

/**
 * Log in user.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.login = async (req, res) => {
    logger.debug('attackController.last();');

    return new Promise((resolve, reject) => {
        passport.authenticate('api-local', function (err, user, info) {
            if (err) return reject(err);
            if (!user) return reject(new Error());

            resolve(() => { res.json({ token: user.token }); });
        })(req, res);
    });
};
