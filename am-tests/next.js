var am = require('../am.js'),
  assert = require('assert')

describe('.next()', function() {
  describe('Synchronous', function() {
    it('should return extended promise resolving to returned value', function(done) {
      let ep = am([5, 6, 7]).next(function(item) {
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
  describe('Synchronous - no returned value from function', function() {
    it('should return extended promise resolving to original value', function(done) {
      let ep = am([5, 6, 7]).next(function(item) {})
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
  describe('Generator (Asynchronous) - no returned value from generator', function() {
    it('should return extended promise resolving to original value', function(done) {
      assert.ok(
        am([5, 6, 7])
          .next(function*(items) {
            yield Promise.resolve({ a: 56 })
          })
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
  describe('If Argument other than a function or generator', function() {
    it('passes through original resolved value', function(done) {
      assert.ok(
        am([5, 6, 7])
          .next(true)
          .then(r => {
            assert.deepStrictEqual(r, [5, 6, 7])
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
    it('===>should return extended promise resolving or rejecting to returned value of anonymous class', function(done) {
      let ep = am(56)
        .next(
          'test',
          class {
            async test(methodArg, value) {
              assert.equal(methodArg, 'method argument')
              return await Promise.resolve(89 + (value || 0))
            }
          },
          'method argument'
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
      let ep = am(56)
        .next(
          'test',
          new class {
            async test(methodArg, value) {
              assert.equal(methodArg, 'method argument')
              return await Promise.resolve(89 + (value || 0))
            }
          }(),
          'method argument'
        )
        .next(r => {
          assert.ok(ep instanceof am.ExtendedPromise)

          assert.equal(r, 145)
          done()
        })
        .catch(err => {
          console.log(err)
          assert.fail(err, null, 'anon class fail')
          done()
        })
    })
  })
  describe('\n    Named Class', function() {
    it('should return extended promise resolving or rejecting to returned value of anonymous class', function(done) {
      let sample = class {
        async test(value) {
          return await Promise.resolve(89 + (value || 0))
        }
      }
      let ep = am(56)
        .next('test', sample)
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
        async test(value) {
          return await Promise.resolve(89 + (this.type || 0) + (value || 0))
        }
      }
      let ep = am(56)
        .next('test', new sample(45))
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
        .next('test', new sample(45))
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
          .next(function*(items) {
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
