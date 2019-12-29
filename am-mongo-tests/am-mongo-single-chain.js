let am = require('../am.js')
let assert = require('assert')
let testDB
let url = 'mongodb://127.0.0.1:27017'

describe('Single Chain Database Connection', () => {
  before(done => {
    //
    // Connect to the db
    testDB = am()
      .connect(url, 'test')
      .next(db => {
        am('user, location, balance, bank'.split(', '))
          .forEach(function * (collection) {
            if (yield testDB.isCollection(collection)) {
              yield testDB.dropCollection(collection)
            }
            switch (collection) {
              case 'user':
                yield testDB.insert(collection)({ name: 'Max', balance: 4567 })
                yield testDB.insert(collection)({ name: 'Max', balance: 1234 })
                yield testDB.insert(collection)({ name: 'Mary', balance: 8971 })

                break
              case 'balance':
                yield testDB.insert(collection)({ name: 'Max', account: 'HSBC', amount: 4567 })
                yield testDB.insert(collection)({ name: 'Mary', account: 'HSBC', amount: 8971 })
                break
              case 'location':
                yield testDB.insert(collection)({
                  city: 'London',
                  postcode: 'W1A 7YT',
                  geo: {
                    type: 'Point',
                    coordinates: [-0.2416813, 51.5285582]
                  }
                })
                yield testDB.insert(collection)({
                  city: 'New York',
                  postcode: '3456783',
                  geo: {
                    type: 'Point',
                    coordinates: [-73.856077, 40.848447]
                  }
                })
                testDB.createIndex('location')({ geo: '2dsphere' })
                break
            }
          })
          .then(() => {
            return testDB.collectionNames()
          })
          .next(collections => {
            collections.filter(function (collectionName) {
              if (collectionName !== 'system.version') {
                return true
              }
            })
            done()
          })
          .catch(err => {
            console.log(39, err)
          })
      })
  })
  it('should pass Database connection through the chain, including through prev()', done => {
    testDB

      .next(result => {
        assert.strictEqual(testDB._state_.db && testDB._state_.db().databaseName, 'test')
        return 188
      })

      .next(result => result)
      .prev()
      .next(value => {
        assert.strictEqual(value, 188)
        done()
      })
  })
  it('should export the database connection as .db() allowing access to other methods', done => {
    let db, collection
    try {
      db = testDB.db()
      collection = db.collection('user')
      assert.strictEqual(collection.collectionName, 'user')

      done()
    } catch (err) {
      assert.fail(err, null, '')
      done()
    }
  })
  it('should export the MongoCLient as .client() allowing access to other methods', done => {
    let client
    try {
      client = testDB.client()
      assert.strictEqual(client && client.constructor && client.constructor.name, 'MongoClient')

      done()
    } catch (err) {
      assert.fail(err, null, '')
      done()
    }
  })
  it('.collections()', done => {
    testDB.collections().next(results => {
      assert.strictEqual(results.length, 3)
      done()
    })
  })
  it('.collection()', done => {
    testDB
      .collection('user')

      .next(result => {
        assert.strictEqual(result.collectionName, 'user')
        done()
      })
  })
  it('.collectionNames()', done => {
    testDB.collectionNames().next(result => {
      assert.notStrictEqual(result.indexOf('user'), -1)
      done()
    })
  })
  it('.count()', done => {
    testDB
      .count('user')
      .next(result => {
        assert.strictEqual(result, 3)
      })
      .count()
      .next(result => {
        assert.strictEqual(result, 1)
        done()
      })
  })
  it('.createIndex()', done => {
    testDB
      .createIndex('location')({ geo: '2dsphere' })
      .next(result => {
        assert.strictEqual(result, 'geo_2dsphere')
        done()
      })
  })
  it('.distinct()', done => {
    testDB
      .distinct('user')('name')
      .next(result => {
        assert.strictEqual(result.includes('Max'), true)
        assert.strictEqual(result.length, 2)
        done()
      })
  })
  it('.findOne()', done => {
    testDB
      .findOne('user')()
      .next(result => {
        assert.strictEqual(result.balance, 4567)
        done()
      })
  })
  it('.find()', done => {
    testDB
      .find('user')()
      .next(result => {
        assert.strictEqual(result[0].balance, 4567)
        done()
      })
  })
  it('.options()', done => {
    testDB.options('user').next(result => {
      assert.deepStrictEqual(result, {})
      done()
    })
  })
  it('.geoNear', done => {
    testDB
      .geoNear('location')(-0.24, 51.5,
        // https://docs.mongodb.com/manual/reference/operator/aggregation/geoNear/
        {
          distanceField: 'dist.calculated',
          maxDistance: 20000,
          includeLocs: 'dist.location',
          spherical: true
        })
      .next(result => {
        assert.strictEqual(result.results.length, 1)

        done()
      }).error((err) => {
        console.log(err)
        done()
      })
  })
  it('.insert()', done => {
    testDB
      .insert('user')([{ name: 'Fred' }, { name: 'Tom' }])
      .next(result => {
        assert.strictEqual(result[0].name, 'Fred')
        done()
      })
  })
  it('.insertOne()', done => {
    testDB
      .insertOne('user')({ name: 'Freda' })
      .next(result => {
        assert.strictEqual(result.name, 'Freda')
        done()
      })
  })
  it('.isCollection()', done => {
    testDB.isCollection('user').next(result => {
      assert.ok(result)
      done()
    })
  })
  it('.update()', done => {
    testDB
      .update('user')(
        {},
        {
          done: Math.random()
            .toString()
            .substr(0, 3)
        }
      )
      .next(result => {
        assert.strictEqual(result.nModified, 6)
        done()
      })
  })
  it('.updateOne()', done => {
    testDB
      .updateOne('user')(
        { name: 'Max' },
        {
          done: Math.random()
            .toString()
            .substr(0, 3)
        }
      )
      .next(result => {
        assert.strictEqual(result.nModified, 1)
        done()
      })
      .error(err => {
        assert.fail(err)
        done()
      })
      .catch(done)
  })
  it('.upsertOne()', done => {
    testDB
      .upsertOne('user')(
        { name: 'Fredat' },
        {
          name: 'Fredat',
          done: Math.random()
            .toString()
            .substr(0, 3)
        }
      )
      .next(result => {
        assert.strictEqual(result.upserted.length, 1)
        done()
      })
  })
  it('.deleteOne()', done => {
    testDB
      .deleteOne('user')({ name: 'Fredat' })
      .next(result => {
        assert.strictEqual(result.n, 1)
        done()
      })
  })
  it('.deleteMany()', done => {
    testDB
      .deleteMany('user')({ name: 'Freda' })
      .next(result => {
        assert.strictEqual(result.n, 1)
        done()
      })
  })
  it('.upsert()', done => {
    testDB
      .upsert('user')(
        { name: 'Freddy' },
        {
          name: 'Freddy',
          done: Math.random()
            .toString()
            .substr(0, 3)
        }
      )
      .next(result => {
        assert.strictEqual(result.upserted.length, 1)
        done()
      })
  })
  it('.dropCollection()', done => {
    testDB.dropCollection('location').next(result => {
      assert.ok(result)
      done()
    })
  })
  it('.close()', done => {
    testDB
      .close()
      .collectionNames()
      .error(() => {
        assert.ok(true)
        done()
      })
      .catch(done)
  })
})
