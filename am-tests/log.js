var am = require('../am.js'),
  assert = require('assert'),
  intercept = require('intercept-stdout'),
  logs = [],
  unhook_intercept = intercept(function(txt) {
    logs.push(txt)
  })

describe('log()', function() {
  describe('log resolved value', function() {
    it('should return extended promise resolving to original resolved value and log value', function(done) {
      am([123, 456])
        .log()
        .wait(20)
        .then(function(r) {
          assert.ok(
            logs[logs.length - 1].trim().indexOf('123') !== -1 &&
              logs[logs.length - 1].trim().indexOf('456') !== -1
          )
          done()
        })
        .catch(done)
    })
  })
  describe('log resolved value and label', function() {
    it('should return extended promise resolving to original resolved value and label', function(done) {
      am([123, 456])
        .log('[log-test]')
        .wait(20)
        .then(function(r) {
          assert.ok(
            logs[logs.length - 1].trim().indexOf('123') !== -1 &&
              logs[logs.length - 1].trim().indexOf('456') !== -1 &&
              logs[logs.length - 1].trim().indexOf(['log-test']) !== -1
          )
          done()
        })
        .catch(done)
    })
  })
  describe('log resolved value and line number', function() {
    it('should return extended promise resolving to original resolved value and label', function(done) {
      am([123, 456])
        .log('[log-test]', '', Error())
        .wait(20)
        .then(function(r) {
          assert.ok(
            logs[logs.length - 1].trim().indexOf('123') !== -1 &&
              logs[logs.length - 1].trim().indexOf('456') !== -1 &&
              logs[logs.length - 1].trim().indexOf('line ') !== -1
          )

          done()
        })
        .catch(done)
    })
  })
  describe('log rejected value', function() {
    it('should return extended promise rejecting to original resolved value and log rejected value', function(done) {
      am
        .reject({ error: 234 })
        .log()
        .wait(20)
        .catch(function(err) {
          assert.deepStrictEqual(err, { error: 234 })
          assert.ok(
            logs[logs.length - 1].trim().indexOf('error') !== -1 &&
              logs[logs.length - 1].trim().indexOf('234') !== -1
          )
          done()
        })
        .catch(done)
    })
  })
  describe('log rejected value and label', function() {
    it('should return extended promise rejecting to original rejected value and log label ', function(done) {
      am
        .reject({ error: 234 })
        .log('[resolve]', '[reject]')
        .wait(20)
        .catch(function(err) {
          assert.deepStrictEqual(err, { error: 234 })
          assert.ok(
            logs[logs.length - 1].trim().indexOf('error') !== -1 &&
              logs[logs.length - 1].trim().indexOf('234') !== -1 &&
              logs[logs.length - 1].trim().indexOf('[reject]') !== -1
          )
          done()
        })
        .catch(done)
    })
  })
})
