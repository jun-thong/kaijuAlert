'use strict';

/**
 * Passport middleware configurations.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    BearerStrategy  = require('passport-bearer-strategy'),

    logger          = require('winston'),
    models          = require('../../models/index.js');

/**
 * Configure passport strategies for api.
 * Set a local strategy to log user in.
 * Then set a bearer token strategy for API calls.
 *
 */
module.exports = function() {
    // setup local strategy
    passport.use('api-local', new LocalStrategy(
        {
            usernameField: 'mail',
            passwordField: 'password'
        },
        _localStrategyImpl
    ));

    // Setup bearer token strategy
    passport.use('api-bearer', new BearerStrategy(_getBearerStrategyImpl));

    passport.serializeUser(function(user, done){
        logger.debug('passport.serializeUser()');
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        logger.debug('passport.deserializeUser()');
        models.User.findById(id, { attributes: ['id', 'nickname', 'avatar', 'countMsgUnread'] })
            .then(function(user){
                return done(null, user);
            })
            .catch(function(err){
                return done(err);
            });
    });
};

/**
 * Define a local strategy to generate to allow user generate a bearer token.
 *
 * @param {String} username
 * @param {String} password
 * @param {Function} done
 * @private
 */
let _localStrategyImpl = (username, password, done) => {
    logger.debug('auth._localStrategyImpl()');

    models.User.findOne({ where: { mail: username } }).then(function(user){
        // check if user exists.
        if(!user) return done(null, false, { message: 'loginInvalidUser' });

        user.comparePassword(password, (err, isMatch) => {
            if (err) return done(null, false, { message: 'loginInvalidPassword' });
            if (isMatch) {
                logger.info('User ' + user.nickname + ' successfully log-in', { id: user.id, mail: user.mail });
                return done(null, user);
            } else {
                // password invalid
                return done(null, false, { message: 'loginInvalidPassword' });
            }
        });
    }).catch((err) => {
        return done(err);
    });
};

/**
 * Define a bearer token strategy.
 *
 * @param {String} token
 * @param {Function} done
 * @private
 */
let _getBearerStrategyImpl = (req, token, done) => {
    logger.debug('auth._getBearerStrategyImpl(token: ' + token + ')');
    // I may store token in an array, different token for different device.
    // This app is still simple, just added this line to show i can think of this kind of details.
    if (token instanceof Array) token = token[0];

    models.User.findOne({ where: { token: token } }).then(function(user){
        // check if token exists.
        if(!user) return done(null, false, { message: 'loginInvalidToken' });
        return done(null, user);
    }).catch((err) => {
        return done(err);
    });
};
