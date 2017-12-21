var am = require('../am.js'),
  assert = require('assert')

describe('static method am.resolve()', () => {
  it('should return extended promise resolving to argument passed', done => {
    let ep = am.resolve([234, 567])
    assert.ok(ep instanceof am.ExtendedPromise)

    ep
      .then(r => {
        assert.deepStrictEqual(r, [234, 567])
        done()
      })
      .catch(err => {
        assert.fail('Errored', err)
      })
      .catch(done)
  })
})
describe('static method am.reject()', () => {
  it('should return extended promise rejecting to argument passed', done => {
    let ep = am.reject({ error: 56 })
    assert.ok(ep instanceof am.ExtendedPromise)

    ep
      .then(r => {
        assert.fail('Resolved', err)
        done()
      })
      .catch(err => {
        assert.deepStrictEqual(err, { error: 56 })
        done()
      })
      .catch(done)
  })
})
