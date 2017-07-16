'use strict';
/**
 * Main test cases.
 *
 * @author jun.thong@me.com (Jun Thong)
 **/

let commonTests          = require('./tools/commonTests.js');

describe('Kaiju alert tests', function(){
    describe('GET /attack/around', () => {
        it('should return a 200 status', commonTests.isUp('/attack/around/35.652832/139.839478'));
    });
});
