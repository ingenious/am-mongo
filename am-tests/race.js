var am = require('../am.js'),
  assert = require('assert')

describe('.race()', () => {
  describe('Array of Generators', function() {
    it('should return extended promise resolving to first returned value of generator', function(done) {
      let ep = am.race([
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
            assert.deepStrictEqual(r, 23864)
            done()
          })
          .catch(err => {
            assert.fail('Generator errored', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if error occurs in a generator', done => {
      let ep = am.race([
        function*() {
          throw { error: 78 }
          return yield 563728
        },
        function*() {
          return yield 23864
        }
      ])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.fail(r, 'Race returned', r)
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
  describe('Array of Promises', () => {
    it('should return extended promise resolving to first resolved value of a promises', done => {
      let ep = am.race([Promise.resolve(23864), Promise.resolve(563728)])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, 23864)
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if a Promise rejects before one resolves', done => {
      let ep = am.race([
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(3545354)
          }, 200)
        }),
        Promise.reject({ error: 67 })
      ])
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
  describe('Array of Functions with callbacks', () => {
    it('should return extended promise resolving to first  returned values from callbacks', function(done) {
      let ep = am.race([
        cb => {
          cb(null, 23864)
        },
        cb => {
          cb(null, 563728)
        }
      ])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, 23864)
            done()
          })
          .catch(err => {
            assert.fail('Callback returned error', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if a callback returns error before one returns value', done => {
      let ep = am.race([
        cb => {
          setTimeout(() => {
            cb(null, 23864)
          }, 200)
        },
        cb => {
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
  describe('Object Generators', () => {
    it('should return extended promise resolving to first returned value of a generator', function(done) {
      let ep = am.race({
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
            assert.deepStrictEqual(r, { a: 23864 })
            done()
          })
          .catch(err => {
            assert.fail('Generator errored', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if error occurs in a generator', done => {
      let ep = am.race({
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
  describe('Object of Promises', () => {
    it('should return extended promise resolving to first resolved value of a promise', function(done) {
      let ep = am.race({ a: Promise.resolve(23864), b: Promise.resolve(563728) })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, { a: 23864 })
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if Promise rejects', done => {
      let ep = am.race({
        a: new Promise(resolve => {
          setTimeout(() => {
            resolve(23864)
          }, 10)
        }),
        b: Promise.reject({ error: 67 })
      })
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
  describe('Object of Functions with callbacks', () => {
    it('should return extended promise resolving to first returned value from callbacks', function(done) {
      let ep = am.race({
        a: cb => {
          cb(null, 23864)
        },
        b: cb => {
          cb(null, 563728)
        }
      })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, { a: 23864 })
            done()
          })
          .catch(err => {
            assert.fail('Callback returned error', err)
          })
          .catch(done) instanceof Promise
      )
    })
    it('should reject if a callback returns error', done => {
      let ep = am.race({
        a: cb => {
          setTimeout(() => {
            cb(null, 23864)
          })
        },
        b: cb => {
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
