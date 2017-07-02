'use strict';
/**
 * Define all API routes.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let router                  = require('express').Router(),
    routerAuth              = require('express').Router(),
    passport                = require('passport'),
    attackController        = require('../controllers/attackController.js'),
    ensureAuth              = require('../middlewares/passport/ensureAuthenticated.js'),
    wrap                    = require('../middlewares/errorHandlers/errorsHandler').wrapper;

/**
 * Configure route for the web app.
 * /!\ all controller method used by get(), post()... must be async and wrapped with wrap()
 *
 * delete() and put() method got a POST failover.
 *
 * @param {Object} app , an express app.
 */
module.exports = function(app){
    // passport routes
    router.post('/login',
        passport.authenticate('www-local', { successRedirect: '/dashboard',
            failureRedirect: '/',
            failureFlash: true })
    );

    routerAuth.get('/attack/last', wrap(attackController.last));
    routerAuth.get('/attack/around/:lat/:lon', wrap(attackController.around));
    routerAuth.post('/attack/create', wrap(attackController.create));
    routerAuth.put('/attack/update', wrap(attackController.update));
    routerAuth.post('/attack/update', wrap(attackController.update));
    routerAuth.delete('/attack/delete/:id', wrap(attackController.delete));
    routerAuth.post('/attack/delete/:id', wrap(attackController.delete));

    // finally apply the router to the app.
    app.use('/', router);
    // TODO implement ensureAuth
    //app.use('/', ensureAuth, routerAuth);
    app.use('/', routerAuth);
};
