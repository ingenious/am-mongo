var am = require('../am.js'),
  assert = require('assert')

describe('static method am.co()', () => {
  it('should return extended promise resolving result of executing a generator any passed arguments', done => {
    let ep = am.co(
      function*(a, b) {
        return yield a + b
      },
      345,
      678
    )
    assert.ok(ep instanceof am.ExtendedPromise)

    ep
      .then(r => {
        assert.deepStrictEqual(r, 1023)
        done()
      })
      .catch(err => {
        assert.fail('Generator errored', err)
      })
      .catch(done)
  })
  it('should return extended promise rejecting to any error thrown in generator', done => {
    let ep = am.co(
      function*(a, b) {
        throw { error: 89 }
        return yield a + b
      },
      345,
      678
    )
    assert.ok(ep instanceof am.ExtendedPromise)

    ep
      .then(r => {
        assert.fail('Generator returned', err)
        done()
      })
      .catch(err => {
        assert.deepStrictEqual(err, { error: 89 })
        done()
      })
      .catch(done)
  })
})
