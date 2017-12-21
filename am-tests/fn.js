var am = require('../am.js'),
  assert = require('assert')

describe('static method am.fn()', function() {
  it('should return extended promise resolving result of executing the function with any passed arguments', done => {
    let ep = am.fn(
      (a, b) => {
        return a + b
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
        assert.fail('Promise rejected', err)
      })
      .catch(done)
  })
})

describe('static method am.sfn()', function() {
  it('should return extended promise resolving result of executing a function with success and fail callbacks', done => {
    let ep = am.sfFn(
      (a, b, success, fail) => {
        success(a + b)
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
        assert.fail('Promise rejected', err)
      })
      .catch(done)
  })
  it('should return extended promise rejecting error returned when  executing a function with success and fail callbacks', done => {
    let ep = am.sfFn(
      (a, b, success, fail) => {
        fail({ error: 89 })
      },
      345,
      678
    )
    assert.ok(ep instanceof am.ExtendedPromise)

    ep
      .then(r => {
        assert.fail('Success function returned', err)
        done()
      })
      .catch(err => {
        assert.deepStrictEqual(err, { error: 89 })
        done()
      })
      .catch(done)
  })
})
