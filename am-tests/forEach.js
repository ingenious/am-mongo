var am = require('../am.js'),
  assert = require('assert')

describe('.forEach()', () => {
  describe('Array applied to  function (synchronous)', () => {
    it('should return extended promise resolving to array of returned values in \n        forEach function', function(done) {
      let ep = am([5, 6, 7]).forEach(item => {
        return item / 2
      })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, [5, 6, 7])
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Non-array/object Array applied to function (synchronous)', () => {
    it('should return extended promise resolving to value', function(done) {
      let ep = am(567).forEach((item, i) => {
        return item / 2
      })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .then(r => {
          assert.deepStrictEqual(r, 567)
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })

  describe('Array applied to Class (synchronous/asynchronous)', () => {
    it('should return extended promise resolving to array of synchronously/asynchronously \n        returned values in forEach class', function(done) {
      let test = []
      am([4, 5, 6])
        .forEach(
          'asyncMap',
          class {
            async asyncMap(value, i) {
              test.push(await Promise.resolve(value))
            }
          }
        )
        .forEach(
          'syncMap',
          class {
            syncMap(value, i) {
              test.push(2 * value)
            }
          }
        )
        .next(r => {
          assert.deepEqual(test, [4, 5, 6, 8, 10, 12])
          done()
        })
        .error(err => {
          assert.fail(err, null, '')
          done()
        })
        .catch(done)
    })
  })

  describe('non-Array/Object applied to Class (synchronous/asynchronous)', () => {
    it('should return extended promise resolving to array of synchronously/asynchronously \n        returned values in forEach class', function(done) {
      let test = []
      am(66)
        .forEach(
          'asyncMap',
          class {
            async asyncMap(value, i) {
              test.push(await Promise.resolve(value))
            }
          }
        )
        .forEach(
          'syncMap',
          class {
            syncMap(value, i) {
              test.push(2 * value)
            }
          }
        )
        .next(r => {
          assert.deepEqual(test, [66, 132])
          done()
        })
        .error(err => {
          assert.fail(err, null, '')
          done()
        })
        .catch(done)
    })
  })
  describe('Array applied to Generator  asynchronous', () => {
    it('should return extended promise resolving to array of asynchronously \n        returned values in forEach generator function', function(done) {
      let ep = am([34, 56, 78]).forEach(function*(value, i, array) {
        assert.deepStrictEqual(array, [34, 56, 78])
        switch (i) {
          case 0:
            assert.equal(value, 34)
            break
          case 1:
            assert.equal(value, 56)
            break
          case 2:
            assert.equal(value, 78)
            break
        }
        return yield am.resolve(2 * value)
      })
      assert.ok(ep instanceof am.ExtendedPromise)

      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, [34, 56, 78])
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('non-Array/Object applied to Generator (asynchronous)', () => {
    it('should return extended promise resolving to array of asynchronously \n        returned values in forEach generator function', function(done) {
      let ep = am('test').forEach(function*(value, i, array) {
        assert.deepStrictEqual(yield array, ['test'])
        assert.equal(yield i, 0)
        switch (i) {
          case 0:
            assert.equal(value, 'test')
            break
        }
        return yield am.resolve(value + 'a')
      })
      assert.ok(ep instanceof am.ExtendedPromise)

      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, 'test')
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Error handling - error passed to catch', () => {
    it('should reject ', done => {
      assert.ok(
        am([5, 6, 7])
          .forEach(function*(item, i) {
            if (i) {
              throw { error: 57 }
            }
            yield Promise.resolve(item / 2)
          })
          .then(r => {
            assert.fail()
          })
          .catch(err => {
            assert.deepStrictEqual(err, { error: 57 })
            done()
          })
          .catch(done) instanceof Promise
      )
    })
  })

  describe('Object applied to function (synchronous)', () => {
    it('should return extended promise resolving to object with returned values in \n        map function', function(done) {
      let ep = am({ a: 123, b: 45 }).forEach((value, attr, object) => {
        assert.deepStrictEqual(object, { a: 123, b: 45 })
        switch (attr) {
          case 'a':
            assert.equal(value, 123)
            break
          case 'b':
            assert.equal(value, 45)
            break
        }
      })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, { a: 123, b: 45 })
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Object applied to generator (asynchronous)', () => {
    it('should return extended promise resolving to object with asynchronously \n        returned values in map generator function', function(done) {
      let ep = am({ a: 123, b: 45 }).forEach(function*(value, attr, object) {
        assert.deepStrictEqual(object, { a: 123, b: 45 })
        let result = yield Promise.resolve(value / 2)
        switch (attr) {
          case 'a':
            assert.equal(result, 61.5)
            break
          case 'b':
            assert.equal(result, 22.5)
            break
        }
      })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, { a: 123, b: 45 })
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
})

// =======================================

//  static forEach

// ========================================

describe('static method am.forEach()', () => {
  describe('Array of functions with callback', () => {
    it('should return extended promise resolving to array of values returned in callback', function(done) {
      let ep = am.forEach([
        function(i, cb) {
          cb(null, 2 * i)
        },
        function(i, cb) {
          cb(null, 2 * i)
        }
      ])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, [0, 2])
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Array of generators', () => {
    it('should return extended promise resolving to array of asynchronously \n        returned values in map generator function', function(done) {
      let ep = am.forEach([
        function*(i) {
          return yield 2 * i
        },
        function*(i) {
          return yield 3 * i
        }
      ])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, [0, 3])
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
})
