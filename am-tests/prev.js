var am = require('../am.js'),
  assert = require('assert')

describe('prev()', function() {
  describe('After map', function() {
    it('should return extended promise resolving to original resolved value', function(done) {
      let ep = am(function*() {
        yield Promise.resolve()
        return { a: 238 }
      }).map(function(value, attr) {
        return value * 2
      })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .prev()
        .then(r => {
          assert.deepStrictEqual(r, { a: 238 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('After map and filter (2 steps)', function() {
    it('should return extended promise resolving to original resolved value', function(done) {
      let ep = am(function*() {
        yield Promise.resolve()
        return { a: 238, b: 56 }
      })
        .map(function(value, attr) {
          return value * 2
        })
        .filter(function(value, attr) {
          return attr === 'a' ? true : false
        })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .prev()
        .prev()
        .then(r => {
          assert.deepStrictEqual(r, { a: 238, b: 56 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('After map and wait', function() {
    it('should return extended promise resolving to original resolved value', function(done) {
      let ep = am(function*() {
        yield Promise.resolve()
        return { a: 238, b: 56 }
      })
        .map(function(value, attr) {
          return value * 2
        })
        .wait(200)

        .prev()

        .then(r => {
          assert.ok(ep instanceof am.ExtendedPromise)
          assert.deepStrictEqual(r, { a: 238, b: 56 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('After map and log', function() {
    it('should return extended promise resolving to original resolved value', function(done) {
      let ep = am(function*() {
        yield Promise.resolve()
        return { a: 238, b: 56 }
      })
        .map(function(value, attr) {
          return value * 2
        })
        .log('\n     ')

      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .prev()
        .then(r => {
          assert.deepStrictEqual(r, { a: 238, b: 56 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })

  describe('\n    After mapFilter', function() {
    it('should return extended promise resolving to original resolved value', function(done) {
      let ep = am(function*() {
        yield Promise.resolve()
        return { a: 238 }
      }).mapFilter(function(value, attr) {
        return value * 2
      })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .prev()
        .then(r => {
          assert.deepStrictEqual(r, { a: 238 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('After filter', function() {
    it('should return extended promise resolving to original resolved value', function(done) {
      let ep = am(function*() {
        yield Promise.resolve()
        return { a: 238 }
      }).filter(function(value, attr) {
        return value * 2
      })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .prev()
        .then(r => {
          assert.deepStrictEqual(r, { a: 238 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('After next', function() {
    it('should return extended promise resolving to original resolved value', function(done) {
      let ep = am(function*() {
        yield Promise.resolve()
        return { a: 238 }
      }).next(function(object) {
        return { b: 789 }
      })
      assert.ok(ep instanceof am.ExtendedPromise)
      ep
        .prev()
        .then(r => {
          assert.deepStrictEqual(r, { a: 238 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('After next with error', function() {
    it('should return extended promise resolving to original resolved value', function(done) {
      let ep = am(function*() {
        yield Promise.resolve()
        return { a: 238 }
      })
        .next(function(object) {
          throw { error: 12 }
          return { b: 789 }
        })
        .prev()
        .then(r => {
          assert.deepStrictEqual(r, { a: 238 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })

  describe('After error', function() {
    it('should return extended promise rejecting to original reject value', function(done) {
      let ep = am.reject({ error: 89 }).error(function(object) {
        return { b: 789 }
      })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .prev()
        .catch(r => {
          assert.deepStrictEqual(r, { error: 89 })
          done()
        })
        .catch(done)
    })
  })
  describe('After error with error in code', function() {
    it('should return extended promise rejecting to original reject value', function(done) {
      let ep = am.reject({ error: 89 }).error(function(object) {
        throw { error: 12 }
      })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .prev()
        .catch(r => {
          assert.deepStrictEqual(r, { error: 89 })
          done()
        })
        .catch(done)
    })
  })
  describe('After error - no returned value', function() {
    it('should return extended promise rejecting to original reject value', function(done) {
      let ep = am.reject({ error: 89 }).error(function(object) {})
      assert.ok(ep instanceof am.ExtendedPromise)
      ep
        .prev()
        .catch(r => {
          assert.deepStrictEqual(r, { error: 89 })
          done()
        })
        .catch(done)
    })
  })
})
