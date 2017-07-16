'use strict';
/**
 * Common cases.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let req         = require('supertest'),
    app         = require('../../app');

let token       = '?access_token=00000000-0000-0000-0000-000000000000';

module.exports.isUp = function(url){
     return req(app)
            .get(url + token)
            .expect(200)
            .expect('Content-Type', /json/);
};
