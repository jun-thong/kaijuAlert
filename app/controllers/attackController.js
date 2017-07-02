'use strict';
/**
 * Define attacks related controllers.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let logger          = require('winston'),
    attackService   = require('../services/attackService.js');

/**
 * GET /attack/last handler.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.last = async (req, res) => {
    logger.debug('attackController.last();');

    res.json({
        lastAttacks: await attackService.getLastAttacks()
    });
};

/**
 * GET /attack/around handler.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.around = async (req, res) => {
  logger.debug('attackController.around(lat= ' + req.params.lat + ', lon= ' + req.params.lon + ')');

  res.json({
     attacks: await attackService.getAttackAroundUser(req.params.lat, req.params.lon)
  });
};

/**
 * POST /attack/create handler.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.create = async (req, res) => {
    logger.debug('attackController.create(data= ' + req.body.data + ')');

    // req.body.data MUST be a JSON serialized object.
    // I'll avoid a SyntaxError from JSON.parse(), to keep my ORM managing the validation process.
    let data = JSON.Parse(req.body.data) || {};
    // No need to check req.user.id, provided by the authentication. I'll just put it in the data object.
    data.createdBy = req.user.id;

    await attackService.create(data);
    res.json({ success: true });
};

/**
 * PUT /attack/update handler.
 * Also handle POST request, just in case.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.update = async (req, res) => {
    logger.debug('attackController.update(data= ' + req.body.data + ')');

    // @see attackController.create()
    let data = JSON.Parse(req.body.data) || {};
    // just to prevent some ambiguity.
    data.createdBy = req.user.id;

    await attackService.update(data);
    res.json({ success: true });
};

/**
 * DELETE /attack/delete handler
 * Also handle POST request, just in case.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise.<void>}
 */
module.exports.delete = async (req, res) => {
    logger.debug('attackController.delete(id= ' + req.params.id + ')');

    await attackService.delete(req.params.id);
    res.json({ success: true });
};