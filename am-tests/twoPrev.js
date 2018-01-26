var am = require('../am.js'),
  assert = require('assert')

describe('.twoPrev()', function() {
  describe('Synchronous', function() {
    it('should pass two arguments to function - last result and previous result', function(done) {
      let ep = am([5, 6, 7])
        .next(function(item) {
          return { a: 2 }
        })
        .next(function(item) {
          return { b: 3 }
        })
        .twoPrev((lastResult, previousResult) => {
          assert.deepStrictEqual(lastResult, { b: 3 })
          assert.deepStrictEqual(previousResult, { a: 2 })

          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('Synchronous - no returned value from function', function() {
    it('should return extended promise resolving to array of previous 2 results', function(done) {
      let ep = am([5, 6, 7])
        .next(function(item) {
          return { second: 897 }
        })
        .twoPrev((result, prev) => {
          assert.deepStrictEqual(result, { second: 897 })
          assert.deepStrictEqual(prev, [5, 6, 7])
        })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .then(r => {
          assert.deepStrictEqual(r, [{ second: 897 }, [5, 6, 7]])
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('Generator (Asynchronous) - no returned value from generator', function() {
    it('should return extended promise resolving to array of previous 2 results', function(done) {
      let ep = am([5, 6, 7])
        .next(function*(item) {
          return yield { second: 897 }
        })
        .twoPrev(function*(result, prev) {
          assert.deepStrictEqual(result, { second: 897 })
          assert.deepStrictEqual(prev, [5, 6, 7])
        })
      assert.ok(ep instanceof am.ExtendedPromise)

      ep
        .then(r => {
          assert.deepStrictEqual(r, [{ second: 897 }, [5, 6, 7]])
          done()
        })
        .error(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('If Argument other than a class, function or generator', function() {
    it('passes through array of previous 2 results', function(done) {
      assert.ok(
        am([5, 6, 7])
          .next(function*(item) {
            return yield { second: 897 }
          })
          .twoPrev(true)
          .then(r => {
            assert.deepStrictEqual(r, [{ second: 897 }, [5, 6, 7]])
            done()
          })
          .catch(err => {
            console.log(err)
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })

  describe('\n    Anonymous Class', function() {
    it('should return extended promise resolving or rejecting to returned value of anonymous class', function(done) {
      let ep = am(56)
        .next(function(item) {
          return { a: 2 }
        })
        .twoPrev(
          'test',
          class {
            async test(value, previous, extraArg) {
              assert.equal(extraArg, 'extra argument')
              assert.deepEqual(value, { a: 2 })
              assert.deepEqual(previous, 56)
              return await Promise.resolve(89 + (previous || 0))
            }
          },
          'extra argument'
        )
        .next(r => {
          assert.deepEqual(r, 145)
          done()
        })
        .error(err => {
          assert.fail(err, null, '')
          console.log(116, err)
        })
        .catch(done)
    })
  })
  describe('\n    Anonymous Class (newed)', function() {
    it('101, should return extended promise resolving or rejecting to returned value of anonymous class', function(done) {
      let ep = am(56)
        .next(
          'test',
          new class {
            async test(value) {
              return await Promise.resolve(89 + (value || 0))
            }
          }()
        )
        .twoPrev(
          'test',
          new class {
            test(r, p, extraArg) {
              assert.ok(ep instanceof am.ExtendedPromise)
              assert.equal(extraArg, 'extra argument')
              assert.equal(r, 145)
              assert.equal(p, 56)
              done()
            }
          }(),
          'extra argument'
        )
        .next(r => {
          assert.deepEqual(r, [145, 56, 'extra argument'])
        })
        .error(err => {
          console.log(err)
          assert.fail(err, null, 'anon class fail')
        })
        .catch(done)
    })
  })
  describe('\n    Named Class', function() {
    it('should return extended promise resolving or rejecting to returned value of anonymous class', function(done) {
      let ep,
        sample = class {
          async test(value) {
            return await Promise.resolve(89 + (value || 0))
          }
          *result(r, p) {
            assert.ok(ep instanceof am.ExtendedPromise)
            assert.equal(p, 56)
            assert.equal(r, 145)
            done()
          }
        }
      ep = am(56)
        .next('test', sample)
        .twoPrev('result', sample)
        .error(err => {
          console.log(165, err)
          assert.fail(err, null, '')
        })

        .catch(done)
    })
  })
  describe('\n    Named Class (newed with argument(s))', function() {
    it('should return extended promise resolving or rejecting to returned value of named class method', function(done) {
      let ep,
        sample = class {
          constructor(type) {
            this.type = type
          }
          async test(value) {
            return await Promise.resolve(89 + (this.type || 0) + (value || 0))
          }
          *result(r, p) {
            assert.ok(ep instanceof am.ExtendedPromise)

            assert.equal(r, 190)
            assert.equal(p, 56)
          }
        },
        newed = new sample(45)

      ep = am(56)
        .next('test', newed)
        .twoPrev('result', newed)
        .next(r => {
          assert.deepEqual(r, [190, 56])
          done()
        })
        .error(err => {
          console.log(err)
          assert.fail(err, null, 'named class errors')
        })
        .catch(done)
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
      let ep = am(156)
        .next(() => {
          return 56
        })
        .twoPrev('test', new sample(45))
        .next(r => {
          assert.fail(r, null, "resolved didn't reject")
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
      am([5, 6, 7])
        .twoPrev(function*(items) {
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
        .catch(done)
    })
  })
})
