var am = require('../am.js'),
  assert = require('assert')

describe('.then()', function() {
  describe('Accepts normal function', function() {
    it('should return Promise resolving to returned value', function(done) {
      let ep = am([5, 6, 7]).then(function(item) {
        return { a: 2 }
      })

      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, { a: 2 })
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('No returned value from function', function() {
    it('should return extended promise resolving to undefined', function(done) {
      let ep = am([5, 6, 7]).then(function(items) {})
      assert.ok(ep instanceof Promise)

      ep
        .then(r => {
          assert.deepStrictEqual(r, undefined)
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('if argument is a generator', function() {
    it('should behave as promise and return extended promise resolving to the generator', function(done) {
      assert.ok(
        am([5, 6, 7])
          .then(function*(items) {
            yield Promise.resolve({ a: 56 })
          })
          .then(r => {
            assert.ok(true)
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Error handling - error passed to catch', function() {
    it('should reject ', done => {
      assert.ok(
        am([5, 6, 7])
          .then(function(items) {
            throw { error: 57 }

            return Promise.resolve(items)
          })
          .catch(function(err) {
            assert.deepStrictEqual(err, { error: 57 })
            done()
          })
          .catch(done) instanceof Promise
      )
    })
  })
})
