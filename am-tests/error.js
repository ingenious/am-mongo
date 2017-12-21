var am = require('../am.js'),
  assert = require('assert')

describe('.error()', function() {
  describe('Synchronous', function() {
    it('should return extended promise resolving to returned value', function(done) {
      let ep = am.reject({ error: 67 }).error(function(err) {
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
  describe('Synchronous with Class', function() {
    it('should return extended promise resolving to returned value', function(done) {
      let ep = am.reject({ error: 67 }).error(
        'syncMethod',
        class {
          syncMethod() {
            return { a: 2 }
          }
        }
      )
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
  describe('Synchronous - no returned value from function', function() {
    it('should return extended promise resolving to undefined', function(done) {
      let ep = am.reject({ error: 56 }).error(function(err) {})
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, undefined)
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Generator (Asynchronous) - no returned value from generator', function() {
    it('should return extended promise resolving to undefined', function(done) {
      let ep = am.reject({ error: 56 }).error(function*(err) {
        // no return value
      })
      assert.ok(ep instanceof am.ExtendedPromise)

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

  describe('Class (Synchronous/Asynchronous) - no returned value from generator', function() {
    it('should return extended promise resolving to undefined', function(done) {
      let ep = am.reject({ error: 56 }).error(
        'syncMethod',
        class {
          async syncMethod() {}
        }
      )
      assert.ok(ep instanceof am.ExtendedPromise)

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
  describe('If argument other than a function or generator', function() {
    it('passes through original rejected value', function(done) {
      let ep = am.reject({ error: 56 })
      assert.ok(ep instanceof am.ExtendedPromise)
      ep
        .error(true)
        .error(r => {
          assert.deepStrictEqual(r, { error: 56 })
          done()
        })
        .catch(done) instanceof Promise
    })
  })
  describe('Error handling - error passed to catch', function() {
    it('should reject ', done => {
      let ep = am.reject({ error: 56 }).error(function(err) {
        throw { error: 99 }
      })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .catch(function(err) {
          assert.deepStrictEqual(err, { error: 99 })
          done()
        })
        .catch(done)
    })
  })
})
