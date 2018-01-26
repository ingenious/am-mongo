var am = require('../am.js'),
  assert = require('assert')

describe('Wrapping', function() {
  describe('Generator', function() {
    it('should return extended promise resolving to returned value of generator', function(done) {
      let ep = am(function*() {
        yield Promise.resolve()
        return { a: 23864 }
      })
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
    it('should return extended promise rejecting to an error occuring in the generator', function(done) {
      let ep = am(function*() {
        throw { error: 567 }
        return yield Promise.resolve({ a: 23864 })
      })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep.catch(r => {
          assert.deepStrictEqual(r, { error: 567 })
          done()
        }) instanceof Promise
      )
    })
    it('should allow Promise to be yielded in wrapped generator', function(done) {
      am(function*() {
        return yield Promise.resolve({ a: 23864 })
      })
        .then(r => {
          assert.deepStrictEqual(r, { a: 23864 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
    it('should allow Generator to be yielded in wrapped generator', function(done) {
      am(function*() {
        return yield function*() {
          return yield Promise.resolve({ a: 23864 })
        }
      })
        .then(r => {
          assert.deepStrictEqual(r, { a: 23864 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
    it('should allow function with callback to be yielded in wrapped generator', function(done) {
      am(function*(a, b) {
        return yield function(cb) {
          cb(null, [567, 89])
        }
      })
        .then(r => {
          assert.deepStrictEqual(r, [567, 89])
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
    it('should pass an error returned in callback to the reject value of\n        the returned Promise', function(done) {
      am(function*(a, b) {
        return yield function(cb) {
          cb({ error: 78 })
        }
      })
        .then(r => {
          assert.fail()
        })
        .catch(err => {
          assert.deepStrictEqual(err, { error: 78 })
          done()
        })
        .catch(done)
    })
    it('should allow Array of asynchrous oprations to be yielded in\n        wrapped generator', function(done) {
      am(function*() {
        return yield [Promise.resolve(567), Promise.resolve(89)]
      })
        .then(r => {
          assert.deepStrictEqual(r, [567, 89])
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
    it('should allow Object of asynchrous oprations to be yielded in \n        wrapped generator', function(done) {
      am(function*() {
        return yield {
          a: Promise.resolve(567),
          b: function*() {
            return yield Promise.resolve(89)
          }
        }
      })
        .then(r => {
          assert.deepStrictEqual(r, { a: 567, b: 89 })
          done()
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
    it('should allow static entities (boolean, strings etc) to be yielded in \n        wrapped generator', function(done) {
      am(function*() {
        return yield true
      })
        .then(r => {
          assert.deepStrictEqual(r, true)

          am(function*() {
            return yield 56789
          })
            .then(r => {
              assert.deepStrictEqual(r, 56789)
              done()
            })
            .catch(function(err) {
              assert.fail('Promise rejected', err)
            })
            .catch(done)
        })
        .catch(err => {
          assert.fail('Promise rejected', err)
        })
        .catch(done)
    })
  })
  describe('\n          Iterator (Invoked Generator)', function() {
    it('should return extended promise resolving to returned value of invoked generator', function(done) {
      let ep = am(
        (function*(value) {
          return yield Promise.resolve({ a: value })
        })(23864)
      )
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
    it('should return extended promise rejecting to an error occuring in \n        the invoked generator', function(done) {
      let ep = am(
        (function*(value) {
          throw { error: 567 }
          return yield Promise.resolve({ a: value })
        })(23864)
      )
      assert.ok(
        ep
          .catch(r => {
            assert.deepStrictEqual(r, { error: 567 })
            done()
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('\n     Array', function() {
    it('should return Promise resolving to an array', function(done) {
      let ep = am([2, 3])
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.ok(r instanceof Array)
            assert.deepStrictEqual(r, [2, 3])
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('\n     Object', function() {
    it('should return Promise resolving to an object', function(done) {
      let ep = am({ a: 2, b: 3 })
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.ok(r instanceof Object)
            assert.deepStrictEqual(r, { a: 2, b: 3 })
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('\n     Promise', function() {
    it('should return extended promise resolving or rejecting to resolved or \n        rejected value of wrapped extended promise', function(done) {
      let ep = am(Promise.resolve(56789))
      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.equal(r, 56789)
            assert.ok(
              am(Promise.reject({ error: 56789 })).catch(r => {
                assert.deepStrictEqual(r, { error: 56789 })
                done()
              }) instanceof Promise
            )
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('\n     Anonymous Class', function() {
    it('should return extended promise resolving to returned value of anonymous class', function(done) {
      let ep = am(
        'test',
        class {
          async test() {
            return await Promise.resolve(56789)
          }
        }
      ).next(r => {
        assert.ok(ep instanceof am.ExtendedPromise)
        assert.equal(r, 56789)
        done()
      })
    })
    it('should return extended promise rejecting to rejected value of await statement in anonymous class', function(done) {
      let ep = am(
        'test',
        class {
          async test() {
            return await Promise.reject({ e: 567 })
          }
        }
      )
        .next(r => {
          assert.ok(ep instanceof am.ExtendedPromise)
          assert.fail(r, null, 'resolved instead of rejecting')
          done()
        })
        .error(err => {
          assert.deepEqual(err, { e: 567 })
          done()
        })
        .catch(done)
    })
    it('should return extended promise resolving to returned non-async await statement value in anonymous class', function(done) {
      let ep = am(
        'test',
        class {
          async test() {
            return await 2223
          }
        }
      ).next(r => {
        assert.ok(ep instanceof am.ExtendedPromise)
        assert.equal(r, 2223)
        done()
      })
    })
    it('should return extended promise rejecting to thrown error in anonymous class', function(done) {
      let ep = am(
        'test',
        class {
          async test() {
            throw { error: 99 }
            return await 2223
          }
        }
      )
        .next(r => {
          assert.fail(r, null, 'resolved instead of rejecting')

          done()
        })
        .error(err => {
          assert.ok(ep instanceof am.ExtendedPromise)
          assert.deepEqual(err, { error: 99 })
          done()
        })
        .catch(done)
    })
  })
  describe('\n     Anonymous Class(newed) with arguments', function() {
    it('should return extended promise resolving or rejecting to returned value of newed anonymous class', function(done) {
      let ep = am(
        'test',
        new class {
          async test(value) {
            return await Promise.resolve(56 + (value || 0))
          }
        }(),
        54
      ).next(r => {
        assert.ok(ep instanceof am.ExtendedPromise)
        assert.equal(r, 110)
        done()
      })
    })
  })
  describe('\n     Named Class ', function() {
    it('should return extended promise resolving or rejecting to returned value of name class', function(done) {
      // named class
      class sample {
        async test(methodArg1, methodArg2) {
          assert.equal(methodArg1, 'method argument 1')
          assert.equal(methodArg2, 'method argument 2')
          return await Promise.resolve(56789)
        }
      }

      let ep = am('test', sample, 'method argument 1', 'method argument 2').next(r => {
        assert.ok(ep instanceof am.ExtendedPromise)
        assert.equal(r, 56789)
        done()
      })
    })
  })
  describe('\n     Named Class (newed) with arguments ', function() {
    it('should return extended promise resolving or rejecting to returned value of named class (newed)', function(done) {
      // named class
      class sample {
        constructor(value) {
          this.value = value
        }
        async test(arg) {
          let self = this

          return await Promise.resolve(5 + (self.value || 0) + (arg || 0))
        }
      }
      // call emthod with

      let ep = am('test', new sample(12), 17)
        .next(r => {
          assert.ok(ep instanceof am.ExtendedPromise)
          assert.equal(r, 34)
          done()
        })
        .error(err => {
          console.log(295, err)
          assert.fail(err, null, 'named class')

          done()
        })
        .catch(done)
    })
  })
})
