var am = require('../am.js'),
  assert = require('assert')

describe('.filter()', () => {
  describe('Array synchronous', () => {
    it('should return extended extended promise resolving to filtered array of returned values in \n        filter function', function(done) {
      let filtered = am([5, 6, 7]).filter(function(item) {
        return item > 5 ? true : false
      })
      assert.ok(filtered instanceof am.ExtendedPromise)
      assert.ok(
        filtered
          .then(r => {
            assert.deepStrictEqual(r, [6, 7])
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('non-Object/Array applied to function (synchronous)', () => {
    it('should return extended extended promise resolving to filtered array of returned values in \n        filter function', function(done) {
      let filtered = am(567).filter(function(item) {
        return item > 5 ? true : false
      })
      assert.ok(filtered instanceof am.ExtendedPromise)
      assert.ok(
        filtered
          .then(r => {
            assert.deepStrictEqual(r, 567)
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Array applied to Class (synchronous/asynchronous)', () => {
    it('should return extended extended promise resolving to filtered array of returned values in \n        class', function(done) {
      am([4, 5, 6])
        .filter(
          'asyncMap',
          class {
            async asyncMap(value, i) {
              return await Promise.resolve(value < 5 ? false : true)
            }
          }
        )
        .filter(
          'syncMap',
          class {
            syncMap(value) {
              return value === 6 ? false : 2 * value
            }
          }
        )
        .next(r => {
          assert.deepEqual(r, [5])
          done()
        })
        .error(err => {
          assert.fail(err, null, '')
          done()
        })
    })
  })
  describe('non-Object/ Array applied to Class (synchronous/asynchronous)', () => {
    it('should return extended extended promise resolving to filtered array of returned values in \n        class', function(done) {
      am(546)
        .filter(
          'asyncMap',
          class {
            async asyncMap(value, i) {
              return await Promise.resolve(value < 5 ? false : true)
            }
          }
        )
        .filter(
          'syncMap',
          class {
            syncMap(value) {
              return value === 6 ? false : 2 * value
            }
          }
        )
        .next(r => {
          assert.deepEqual(r, 546)
          done()
        })
        .error(err => {
          assert.fail(err, null, '')
          done()
        })
        .catch(done)
    })
  })
  describe('Object applied to Class (synchronous/asynchronous)', () => {
    it('should return extended extended promise resolving to filtered array of returned values in \n        class', function(done) {
      am({ a: 4, b: 5, c: 6 })
        .filter(
          'asyncMap',
          class {
            async asyncMap(value, attr) {
              return await Promise.resolve(value < 5 ? false : true)
            }
          }
        )
        .filter(
          'syncMap',
          class {
            syncMap(value, attr) {
              return value === 6 ? false : 2 * value
            }
          }
        )
        .next(r => {
          assert.deepEqual(r, { b: 5 })
          done()
        })
        .error(err => {
          assert.fail(err, null, '')
          done()
        })
    })
  })
  describe('Array applied to Generator (asynchronous)', () => {
    it('should return extended extended promise resolving to filtered array of asynchronously \n        returned values in filter generator function', function(done) {
      let filtered = am([5, 6, 7]).filter(function*(item) {
        let response = yield Promise.resolve(item / 2)
        return response > 2.5 ? true : false
      })
      assert.ok(filtered instanceof am.ExtendedPromise)
      assert.ok(
        filtered
          .then(r => {
            assert.deepStrictEqual(r, [6, 7])
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
    it('should return extended extended promise resolving to filtered array of asynchronously \n        returned values in filter generator function', function(done) {
      let filtered = am(5).filter(function*(item) {
        let response = yield Promise.resolve(item / 2)
        return response > 2.5 ? true : false
      })
      assert.ok(filtered instanceof am.ExtendedPromise)
      filtered
        .then(r => {
          assert.deepStrictEqual(r, null)
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('Error handling - error passed to catch', () => {
    it('should reject ', done => {
      am([5, 6, 7])
        .filter(function*(item, i) {
          if (item === 6) {
            throw { error: 57 }
          }
          return yield Promise.resolve(item / 2)
        })
        .then(r => {
          assert.fail()
        })
        .catch(function(err) {
          assert.deepStrictEqual(err, { error: 57 })
          done()
        })
        .catch(done)
    })
  })
  describe("If generator doesn't return a value", () => {
    it('item is filtered ', done => {
      am([5, 6, 7])
        .filter(function*(item, i) {
          yield Promise.resolve(item / 2)
        })
        .then(r => {
          assert.deepStrictEqual(r, [])
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })

  describe('Error handling - use of tolerant attribute with array', () => {
    it('should resolve with null item values', done => {
      am([5, 6, 7])
        .filter(function*(item, i) {
          if (i) {
            throw { error: 57 }
          }
          return yield Promise.resolve(item / 2)
        }, true)
        .then(r => {
          assert.deepStrictEqual(r, [5])
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('Error handling - use of tolerant attribute with object', () => {
    it('should resolve with null item values', done => {
      am({ a: 2, b: 3 })
        .filter(function*(item, attr) {
          if (attr === 'b') {
            throw { error: 57 }
          }
          return yield Promise.resolve(item / 2)
        }, true)
        .then(r => {
          assert.deepStrictEqual(r, { a: 2 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('Object synchronous', () => {
    it('should return extended extended promise resolving to object with returned values in \n        map function', function(done) {
      assert.ok(
        am({ a: 123, b: 45 })
          .filter(function(value, attr) {
            return attr === 'a' ? true : false
          })
          .then(r => {
            assert.deepStrictEqual(r, { a: 123 })
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Object asynchronous', () => {
    it('should return extended extended promise resolving to object with asynchronously \n        returned values in map generator function', function(done) {
      assert.ok(
        am({ a: 123, b: 45 })
          .filter(function*(value, attr) {
            let response = yield Promise.resolve(value / 2)
            return value > 50 ? true : false
          })
          .then(r => {
            assert.deepStrictEqual(r, { a: 123 })
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

//==============================================================

describe('static method .filter()', () => {
  describe('Array synchronous', () => {
    it('should return extended extended promise resolving to filtered array of returned values in \n        filter function', function(done) {
      let filtered = am.filter([5, 6, 7], function(item) {
        return item > 5 ? true : false
      })
      assert.ok(filtered instanceof am.ExtendedPromise)
      assert.ok(
        filtered
          .then(r => {
            assert.deepStrictEqual(r, [6, 7])
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

describe('Array asynchronous', () => {
  it('should return extended extended promise resolving to filtered array of asynchronously \n        returned values in filter generator function', function(done) {
    let filtered = am.filter([5, 6, 7], function*(item) {
      let response = yield Promise.resolve(item / 2)
      return response > 2.5 ? true : false
    })
    assert.ok(filtered instanceof am.ExtendedPromise)
    assert.ok(
      filtered
        .then(r => {
          assert.deepStrictEqual(r, [6, 7])
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done) instanceof Promise
    )
  })

  describe('Error handling - error passed to catch', () => {
    it('should reject ', done => {
      am
        .filter([5, 6, 7], function*(item, i) {
          if (item === 6) {
            throw { error: 57 }
          }
          return yield Promise.resolve(item / 2)
        })
        .then(r => {
          assert.fail()
        })
        .catch(function(err) {
          assert.deepStrictEqual(err, { error: 57 })
          done()
        })
        .catch(done)
    })
  })
  describe("If generator doesn't return a value", () => {
    it('item is filtered ', done => {
      am
        .filter([5, 6, 7], function*(item, i) {
          yield Promise.resolve(item / 2)
        })
        .then(r => {
          assert.deepStrictEqual(r, [])
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })

  describe('Error handling - use of tolerant attribute with array', () => {
    it('should resolve with null item values', done => {
      am
        .filter(
          [5, 6, 7],
          function*(item, i) {
            if (i) {
              throw { error: 57 }
            }
            return yield Promise.resolve(item / 2)
          },
          true
        )
        .then(r => {
          assert.deepStrictEqual(r, [5])
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('Error handling - use of tolerant attribute with object', () => {
    it('should resolve with null item values', done => {
      am
        .filter(
          { a: 2, b: 3 },
          function*(item, attr) {
            if (attr === 'b') {
              throw { error: 57 }
            }
            return yield Promise.resolve(item / 2)
          },
          true
        )
        .then(r => {
          assert.deepStrictEqual(r, { a: 2 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('Object synchronous', () => {
    it('should return extended extended promise resolving to object with returned values in \n        map function', function(done) {
      assert.ok(
        am
          .filter({ a: 123, b: 45 }, function(value, attr) {
            return attr === 'a' ? true : false
          })
          .then(r => {
            assert.deepStrictEqual(r, { a: 123 })
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('Object asynchronous', () => {
    it('should return extended extended promise resolving to object with asynchronously \n        returned values in map generator function', function(done) {
      assert.ok(
        am
          .filter({ a: 123, b: 45 }, function*(value, attr) {
            let response = yield Promise.resolve(value / 2)
            return value > 50 ? true : false
          })
          .then(r => {
            assert.deepStrictEqual(r, { a: 123 })
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
