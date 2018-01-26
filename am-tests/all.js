var am = require('../am.js'),
  assert = require('assert')


  
describe('.all()', function() {
  describe('Array of Generators', function() {
    it('should return extended promise resolving to array of returned value of generator', function(done) {
      let ep = am.all([
        function*() {
          return yield 23864
        },
        function*() {
          return yield 563728
        }
      ])

      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, [23864, 563728])
            done()
          })
          .catch(err => {
            assert.fail('Generator errored', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if error occurs in a generator', function(done) {
      let ep = am.all([
        function*() {
          return yield 23864
        },
        function*() {
          throw { error: 78 }
          return yield 563728
        }
      ])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.fail('Generator returned', r)
            done()
          })
          .catch(err => {
            assert.deepStrictEqual(err, { error: 78 })
            done()
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Array of Promises', function() {
    it('should return extended promise resolving to array of resolved values of promises', function(done) {
      let ep = am.all([Promise.resolve(23864), Promise.resolve(563728)])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, [23864, 563728])
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if Promise rejects', function(done) {
      let ep = am.all([Promise.resolve(23864), Promise.reject({ error: 67 })])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.fail('Promise resolved', r)
            done()
          })
          .catch(err => {
            assert.deepStrictEqual(err, { error: 67 })
            done()
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Array of Functions with callbacks', function() {
    it('should return extended promise resolving to array of returned values from callbacks', function(done) {
      let ep = am.all([
        function(cb) {
          cb(null, 23864)
        },
        function(cb) {
          cb(null, 563728)
        }
      ])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, [23864, 563728])
            done()
          })
          .catch(err => {
            assert.fail('Callback returned error', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if a callback returns error', function(done) {
      let ep = am.all([
        function(cb) {
          cb(null, 23864)
        },
        function(cb) {
          cb({ error: 45 })
        }
      ])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.fail('callback didn\t error', err)
            done()
          })
          .catch(err => {
            assert.deepStrictEqual(err, { error: 45 })
            done()
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Object Generators', function() {
    it('should return extended promise resolving to object of returned value of generator', function(done) {
      let ep = am.all({
        a: function*() {
          return yield 23864
        },
        b: function*() {
          return yield 563728
        }
      })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, { a: 23864, b: 563728 })
            done()
          })
          .catch(err => {
            assert.fail('Generator errored', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if error occurs in a generator', function(done) {
      let ep = am.all({
        a: function*() {
          return yield 23864
        },
        b: function*() {
          throw { error: 78 }
          return yield 563728
        }
      })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.fail('Generator returned', r)
            done()
          })
          .catch(err => {
            assert.deepStrictEqual(err, { error: 78 })
            done()
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Object of Promises', function() {
    it('should return extended promise resolving to object of resolved values of promises', function(done) {
      let ep = am.all({ a: Promise.resolve(23864), b: Promise.resolve(563728) })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, { a: 23864, b: 563728 })
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if Promise rejects', function(done) {
      let ep = am.all({ a: Promise.resolve(23864), b: Promise.reject({ error: 67 }) })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.fail('Promise resolved', r)
            done()
          })
          .catch(err => {
            assert.deepStrictEqual(err, { error: 67 })
            done()
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Object of Functions with callbacks', function() {
    it('should return extended promise resolving to array of returned values from callbacks', function(done) {
      let ep = am.all({
        a: function(cb) {
          cb(null, 23864)
        },
        b: function(cb) {
          cb(null, 563728)
        }
      })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, { a: 23864, b: 563728 })
            done()
          })
          .catch(err => {
            assert.fail('Callback returned error', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if a callback returns error', function(done) {
      let ep = am.all({
        a: function(cb) {
          cb(null, 23864)
        },
        b: function(cb) {
          cb({ error: 45 })
        }
      })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.fail('callback didn\t error', err)
            done()
          })
          .catch(err => {
            assert.deepStrictEqual(err, { error: 45 })
            done()
          })
          .catch(done) instanceof Promise
      )
    })
  })
})
