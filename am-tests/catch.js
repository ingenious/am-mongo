var am = require('../am.js'),
  assert = require('assert')

describe('.catch()', () => {
  describe('Accepts normal function', () => {
    it('should return Promise resolving to returned value', done => {
      let ep = am([5, 6, 7])
        .then(item => {
          throw { error: 77 }
        })
        .catch(err => {
          return { error: 89 }
        })

      assert.ok(ep instanceof am.ExtendedPromise)
      assert.ok(
        ep
          .then(r => {
            assert.deepStrictEqual(r, { error: 89 })
            done()
          })
          .catch(err => {
            assert.fail('Promise rejected', err)
          })
          .catch(done) instanceof Promise
      )
    })
  })
  describe('No returned value from function', () => {
    it('should return extended promise resolving to undefined', done => {
      let ep = am([5, 6, 7])
        .next(items => {
          throw { error: 67 }
        })
        .catch(err => {
          assert.deepStrictEqual(err, { error: 67 })
          // no returned value
        })
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
  describe('if argument is a generator returns promise resolving to  generator', () => {
    it('should return extended promise', done => {
      am([5, 6, 7])
        .then(items => {
          throw { error: 67 }
        })
        .catch(function*(err) {
          return 68
          assert.fail()
          done()
        })
        .then(err => {
          assert.ok(true)
          done()
        })
        .catch(done)
    })
  })
  describe('Error handling - error passed to catch', () => {
    it('should reject ', done => {
      am([5, 6, 7])
        .then(items => {
          throw { error: 57 }
        })
        .catch(err => {
          throw { error: 99 }
        })
        .catch(err => {
          assert.deepStrictEqual(err, { error: 99 })
          done()
        })
    })
  })
})
