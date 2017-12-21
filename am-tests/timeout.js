var am = require('../am.js'),
  assert = require('assert')

describe('timeout()', function() {
  it('should return extended promise resolving to original resolved value', function(done) {
    let timer = +new Date(),
      ep = am(function*() {
        yield Promise.resolve()
        return { a: 238 }
      }).timeout(250)

    assert.ok(ep instanceof am.ExtendedPromise)

    ep
      .then(r => {
        assert.ok(+new Date() - timer > 230)
        assert.ok(+new Date() - timer < 270)
        assert.deepStrictEqual(r, { a: 238 })
        done()
      })
      .catch(err => {
        assert.fail('Promise rejected', err)
      })
      .catch(done)
  })
})
