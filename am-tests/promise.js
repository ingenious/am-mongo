var am = require('../am.js'),
  assert = require('assert')

describe('.promise()', function() {
  describe('returns an (unextended) Promise with same reject and resolve behaviours', function() {
    it('should return Promise resolving to returned value', function(done) {
      let p = am([5, 6, 7]).promise()
      assert.ok(am.isPromise(p))
      assert.ok(
        p
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

  describe('Error handling - error passed to catch', function() {
    it('should reject ', done => {
      let p = am([5, 6, 7])
        .next(function(items) {
          throw { error: 57 }
        })
        .promise()
      assert.ok(am.isPromise(p))
      p
        .catch(function(err) {
          assert.deepStrictEqual(err, { error: 57 })
          done()
        })
        .catch(done)
    })
  })
})
