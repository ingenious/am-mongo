var am = require('../am.js'),
  assert = require('assert')

describe('.threePrev()', function() {
  describe('Synchronous', function() {
    it('should pass three arguments to handling function - last result, previous result and previous result', function(done) {
      let ep = am([5, 6, 7])
        .next(function(item) {
          return { a: 2 }
        })
        .next(function(item) {
          return { b: 3 }
        })
        .threePrev((lastResult, previousResult, firstResult) => {
          assert.deepStrictEqual(lastResult, { b: 3 })
          assert.deepStrictEqual(previousResult, { a: 2 })
          assert.deepStrictEqual(firstResult, [5, 6, 7])
          return { result: 678 }
          done()
        })
        .next(result => {
          assert.deepStrictEqual(result, { result: 678 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('Synchronous - no returned value from function', function() {
    it('should return extended promise resolving to array of previous three results', function(done) {
      let ep = am([5, 6, 7])
        .next(function(item) {
          return 46
        })
        .next(function(item) {
          return 58
        })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .threePrev((r, p, f) => {
          assert.deepStrictEqual(r, 58)
          assert.deepStrictEqual(p, 46)
          assert.deepStrictEqual(f, [5, 6, 7])
        })
        .next(r => {
          assert.deepStrictEqual(r, [58, 46, [5, 6, 7]])
          done()
        })
        .error(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('Generator (Asynchronous) - no returned value from generator', function() {
    it('should return extended promise resolving to original value', function(done) {
      assert.ok(
        am([5, 6, 7])
          .next(function*(items) {
            return yield Promise.resolve({ a: 56 })
          })
          .next(function*(items) {
            return yield Promise.resolve({ b: 6 })
          })
          .threePrev(function*(r, p, f) {
            assert.deepStrictEqual(r, { b: 6 })
            assert.deepStrictEqual(p, { a: 56 })
            assert.deepStrictEqual(f, [5, 6, 7])
          })
          .next(r => {
            assert.deepStrictEqual(r, [{ b: 6 }, { a: 56 }, [5, 6, 7]])
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('If Argument other than a function or generator', function() {
    it('passes through original resolved value', function(done) {
      am([5, 6, 7])
        .next(function*(items) {
          return yield Promise.resolve({ a: 56 })
        })
        .next(function*(items) {
          return yield Promise.resolve({ b: 6 })
        })
        .threePrev(true)
        .next(r => {
          assert.deepStrictEqual(r, [{ b: 6 }, { a: 56 }, [5, 6, 7]])
          done()
        })
        .error(err => {
          console.log(err)
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })

  describe('\n    Anonymous Class', function() {
    it('should return extended promise resolving or rejecting to returned value of anonymous class', function(done) {
      let ep = am({ b: 6 })
        .next(function*(items) {
          return yield Promise.resolve({ a: 56 })
        })
        .next(function*(items) {
          return yield Promise.resolve(56)
        })
        .threePrev(
          'test',
          class {
            async test(value, prev, first) {
              assert.deepEqual(prev, { a: 56 })
              assert.deepEqual(first, { b: 6 })
              return await Promise.resolve(89 + (value || 0))
            }
          }
        )
        .next(r => {
          assert.ok(ep instanceof am.ExtendedPromise)

          assert.equal(r, 145)
          done()
        })
        .catch(err => {
          assert.fail(err, null, '')
          console.log(err)
          done()
        })
    })
  })
  describe('\n    Anonymous Class (newed)', function() {
    it('101, should return extended promise resolving or rejecting to returned value of anonymous class', function(done) {
      let ep = am({ b: 6 })
        .next(function*(items) {
          return yield Promise.resolve({ a: 56 })
        })
        .next(function*(items) {
          return yield Promise.resolve(56)
        })
        .threePrev(
          'test',
          new class {
            async test(value, prev, first) {
              assert.deepEqual(prev, { a: 56 })
              assert.deepEqual(first, { b: 6 })
              return await Promise.resolve(89 + (value || 0))
            }
          }()
        )
        .next(r => {
          assert.ok(ep instanceof am.ExtendedPromise)

          assert.equal(r, 145)
          done()
        })
        .error(err => {
          console.log(161, err)
          assert.fail(err, null, 'anon class fail')
        })
        .catch(done)
    })
  })
  describe('\n    Named Class', function() {
    it('should return extended promise resolving or rejecting to returned value of anonymous class', function(done) {
      let sample = class {
        async test(value, prev, first, extraArg) {
          assert.equal(extraArg, 'extra argument')
          assert.deepEqual(prev, { a: 56 })
          assert.deepEqual(first, { b: 6 })
          return await Promise.resolve(89 + (value || 0))
        }
      }
      let ep = am({ b: 6 })
        .next(function*(items) {
          return yield Promise.resolve({ a: 56 })
        })
        .next(function*(items) {
          return yield Promise.resolve(56)
        })
        .threePrev('test', sample, 'extra argument')
        .next(r => {
          assert.ok(ep instanceof am.ExtendedPromise)

          assert.equal(r, 145)
          done()
        })
        .catch(err => {
          assert.fail(err, null, '')
          console.log(err)
          done()
        })
    })
  })
  describe('\n    Named Class (newed with argument(s))', function() {
    it('should return extended promise resolving or rejecting to returned value of anonymous class', function(done) {
      let sample = class {
        constructor(type) {
          this.type = type
        }
        async test(value, prev, first, extraArg) {
          assert.equal(extraArg, 'extra argument')
          assert.deepEqual(prev, { a: 56 })
          assert.deepEqual(first, { b: 6 })
          return await Promise.resolve(89 + (this.type || 0) + (value || 0))
        }
      }
      let ep = am({ b: 6 })
        .next(function*(items) {
          return yield Promise.resolve({ a: 56 })
        })
        .next(function*(items) {
          return yield Promise.resolve(56)
        })
        .threePrev('test', new sample(45), 'extra argument')
        .next(r => {
          assert.ok(ep instanceof am.ExtendedPromise)
          assert.equal(r, 190)
          done()
        })
        .catch(err => {
          console.log(err)
          assert.fail(err, null, 'named class errors')
          done()
        })
    })
  })
  describe('\n    Named Class throw in class redirects to catch() or error()', function() {
    it('should return extended promise resolving or rejecting to returned value of named class', function(done) {
      let sample = class {
        constructor(type) {
          this.type = type
        }
        async test(value) {
          await Promise.reject({ error: 89 })
          return await Promise.resolve(89 + (this.type || 0) + (value || 0))
        }
      }
      let ep = am(56)
        .threePrev('test', new sample(45))
        .next(r => {
          assert.ok(ep instanceof am.ExtendedPromise)
          assert.equal(r, 190)
          done()
        })
        .error(err => {
          assert.deepEqual(err, { error: 89 })
          done()
        })
        .catch(done)
    })
  })
  describe('Error handling - error passed to catch', function() {
    it('should reject ', done => {
      assert.ok(
        am([5, 6, 7])
          .threePrev(function*(items) {
            throw { error: 57 }
            return yield Promise.resolve(item / 2)
          })
          .then(r => {
            assert.fail()
          })
          .error(function(err) {
            assert.deepStrictEqual(err, { error: 57 })
            done()
          })
          .catch(done) instanceof Promise
      )
    })
  })
})
