'use strict';
/**
 * Kaiju Alert App.
 *
 * @author jun
 */

/*  =============================================================================
    Dependencies
    ============================================================================= */
let http        = require('http'),
    path        = require('path'),
    logger      = require('winston'),
    express     = require('express'),
    bodyParser  = require('body-parser'),
    compress    = require('compression'),
    passport    = require('passport'),
    cfg         = require('config'),
    errorsHandler = require(path.join(__dirname, 'app/middlewares/errorHandlers/errorsHandler.js')).errorHandler,
    models      = require(path.join(__dirname, 'app/models/index.js'));

/*  =============================================================================
    Configure logs
    ============================================================================= */
require(path.join(__dirname, '/app/middlewares/winston/winston.js'))();

/*  =============================================================================
    Express
    ============================================================================= */
let app =  module.exports = express(),
    server = http.createServer(app);

/*  =============================================================================
    App Configure
    ============================================================================= */

app.disable('x-powered-by');
app.use(compress());

if(process.env.NODE_ENV === 'development') app.use(require(path.join(__dirname, '/app/middlewares/allowCors/allowCors.js')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*  =============================================================================
    Configure Routes
    ============================================================================= */
require(path.join(__dirname, '/app/routers/apiRoutes.js'))(app);

/*  =============================================================================
    Error Handler;
    ============================================================================= */
app.use(errorsHandler);

server.listen(cfg.get('APP.PORT'));
