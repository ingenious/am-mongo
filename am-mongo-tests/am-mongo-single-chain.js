var am = require('../am.js'),
  assert = require('assert'),
  url = 'mongodb://192.168.99.100:32773'

describe('Single Chain Database Connection', () => {
  before(done => {
    //
    // Connect to the db
    testDB = am()
      .connect(url, 'test')
      .next(db => {
        am('user, location, balance, bank'.split(', '))
          .forEach(function*(collection) {
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
            list = collections.filter(function(collectionName) {
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
        assert.equal(testDB._state_.db && testDB._state_.db().s.databaseName, 'test')
        return 188
      })

      .next(result => result)
      .prev()
      .next(value => {
        assert.equal(value, 188)
        done()
      })
  })
  it('should export the database connection as .db() allowing access to other methods', done => {
    let db, collection
    try {
      db = testDB.db()
      collection = db.collection('user')
      assert.equal(collection.collectionName, 'user')

      done()
    } catch (e) {
      assert.fail(err, null, '')
      done()
    }
  })
  it('should export the MongoCLient as .client() allowing access to other methods', done => {
    let client
    try {
      client = testDB.client()
      assert.equal(client && client.constructor && client.constructor.name, 'MongoClient')

      done()
    } catch (e) {
      assert.fail(err, null, '')
      done()
    }
  })
  it('.collections()', done => {
    testDB.collections().next(results => {
      assert.equal(results.length, 3)
      done()
    })
  })
  it('.collection()', done => {
    testDB
      .collection('user')

      .next(result => {
        assert.equal(result.collectionName, 'user')
        done()
      })
  })
  it('.collectionNames()', done => {
    testDB.collectionNames().next(result => {
      assert.notEqual(result.indexOf('user'), -1)
      done()
    })
  })
  it('.count()', done => {
    testDB
      .count('user')
      .next(result => {
        assert.equal(result, 3)
      })
      .count()
      .next(result => {
        assert.equal(result, 1)
        done()
      })
  })
  it('.createIndex()', done => {
    testDB
      .createIndex('location')({ geo: '2dsphere' })
      .next(result => {
        assert.equal(result, 'geo_2dsphere')
        done()
      })
  })
  it('.distinct()', done => {
    testDB
      .distinct('user')('name')
      .next(result => {
        assert.equal(result[0], 'Max')
        done()
      })
  })
  it('.findOne()', done => {
    testDB
      .findOne('user')()
      .next(result => {
        assert.equal(result.balance, 4567)
        done()
      })
  })
  it('.find()', done => {
    testDB
      .find('user')()
      .next(result => {
        assert.equal(result[0].balance, 4567)
        done()
      })
  })
  it('.options()', done => {
    testDB.options('user').next(result => {
      assert.deepEqual(result, {})
      done()
    })
  })
  it('.geoNear', done => {
    testDB
      .geoNear('location')(0.2, 51, { spherical: true, maxDistance: 0.1 })
      .next(result => {
        assert.equal(result.results.length, 1)

        done()
      })
  })
  it('.insert()', done => {
    testDB
      .insert('user')([{ name: 'Fred' }, { name: 'Tom' }])
      .next(result => {
        assert.equal(result[0].name, 'Fred')
        done()
      })
  })
  it('.insertOne()', done => {
    testDB
      .insertOne('user')({ name: 'Freda' })
      .next(result => {
        assert.equal(result.name, 'Freda')
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
        assert.equal(result.nModified, 6)
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
        assert.equal(result.nModified, 1)
        done()
      })
      .error(err => {
        assert.fail(err, null, '')
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
        assert.equal(result.upserted.length, 1)
        done()
      })
  })
  it('.deleteOne()', done => {
    testDB
      .deleteOne('user')({ name: 'Fredat' })
      .next(result => {
        assert.equal(result.n, 1)
        done()
      })
  })
  it('.deleteMany()', done => {
    testDB
      .deleteMany('user')({ name: 'Freda' })
      .next(result => {
        assert.equal(result.n, 1)
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
        assert.equal(result.upserted.length, 1)
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
      .error(err => {
        assert.ok(true)
        done()
      })
      .catch(done)
  })
})
