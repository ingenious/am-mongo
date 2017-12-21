let am = require('../am.js'),
  asyncMethods = require('async-methods'),
  mongodb = require('mongodb'),
  assert = require('assert')
url = '192.168.99.100:32773'

var testDB,
  list = [],
  MongoClient = require('mongodb').MongoClient

describe('Persistent connection to Mongo database ', () => {
  before(done => {
    //
    // Connect to the db
    testDB = am.connect(url, 'test').then(db => {
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
  after(done => {
    if (am.db) {
      am.close()
    }
    done()
  })
  it('should export the database connection as .db allowing access to other methods', done => {
    let collection = am.db.collection('user')
    assert.equal(collection.collectionName, 'user')

    done()
  })
  it('should export the MongoCLient as am.client allowing access to other methods', done => {
    assert.equal(am.client && am.client.constructor && am.client.constructor.name, 'MongoClient')
    done()
  })
  it('should export the database connection as am().db allowing access to other methods', done => {
    let collection = am().db.collection('user')
    assert.equal(collection.collectionName, 'user')
    assert.notEqual(list.indexOf('user'), -1)
    done()
  })
  it('should list a set of collection names using collectionNames()', done => {
    assert.notEqual(list.indexOf('user'), -1)
    done()
  })

  it('should list a set of collection objects using collections()', done => {
    testDB
      .collections()
      .map(collection => {
        return collection.collectionName
      })
      .next(list => {
        assert.notEqual(list.indexOf('user'), -1)
        done()
      })

      .catch(done)
  })
  it('should allow rename of a collection using rename()', done => {
    testDB
      .rename('balance')('bank')

      .next(function*(collection) {
        let banks = yield testDB.find('bank')(),
          balances = yield testDB.find('balance')()
        assert.equal(balances.length, 0)
        assert.equal(banks.length, 2)
        done()
      })
      .catch(done)
  })
  it('should allow drop of a collection using dropCollection()', done => {
    testDB
      .dropCollection('bank')

      .next(function*(list) {
        let balances = yield testDB.find('balance')()
        assert.equal(balances.length, 0)

        done()
      })
      .catch(done)
  })
  it('should retrieve  documents using find()', done => {
    testDB
      .find('user')({ name: 'Max' }, { projection: { name: 1, balance: 1 } })

      .next(records => {
        assert.ok(records[0].name === 'Max' && records[0].balance === 4567)
        assert.ok(records[1].name === 'Max' && records[1].balance === 1234)
        done()
      })
      .catch(done)
  })
  it('should get a list of unique values for an attribute using distinct()', done => {
    testDB
      .distinct('user')('name')
      .next(values => {
        assert.ok(values[0] === 'Max' && values.length === 2)

        done()
      })
      .catch(done)
  })

  it('should retrieve a document using findOne()', done => {
    testDB
      .findOne('user')({ name: 'Max' }, { projection: { name: 1, balance: 1 } })

      .next(record => {
        assert.ok(record.name === 'Max' && record.balance === 4567)

        done()
      })
      .error(err => {
        console.log(122, err)
        done()
      })
      .catch(done)
  })
  it('should retrieve a document using findOne() with projection', done => {
    testDB
      .findOne('user')({ name: 'Max' }, { projection: { name: 1 } })
      .next(record => {
        assert.ok(record.name === 'Max' && !record.balance)

        done()
      })
      .error(err => {
        console.log(122, err)
        done()
      })
      .catch(done)
  })

  it('should identify if a collection exists using isCollection()', done => {
    testDB
      .isCollection('user')
      .next(boolean => {
        assert.ok(boolean)
        done()
      })
      .catch(done)
  })
  it('should remove a named collection using dropCollection()', done => {
    testDB
      .dropCollection('user')
      .next(() => {
        testDB
          .findOne('user')({ name: 'Max' })

          .next(record => {
            assert.ok(record === null)
            done()
          })
      })
      .error(err => {
        assert.fail()
        done()
      })
      .catch(done)
  })
  it('should insert a document into a collection using insertOne() and return inserted record', done => {
    testDB
      .insertOne('user')({ name: 'Max', balance: 4567 })

      .next(record => {
        assert.ok(record._id && record.name === 'Max' && record.balance === 4567)
        done()
      })
      .catch(done)
  })
  it('should insert documents into a collection using insert() and return inserted records', done => {
    testDB
      .insert('user')([{ name: 'Max', balance: 1234 }, { name: 'Mary', balance: 8971 }])

      .next(records => {
        assert.ok(records[0].name === 'Max' && records[0].balance === 1234)
        assert.ok(records[1].name === 'Mary' && records[1].balance === 8971)
        done()
      })
      .catch(done)
  })

  it('should get a count of records in a collection using count(collectionName)', done => {
    testDB
      .count('user')
      .next(count => {
        assert.equal(count, 3)
        done()
      })
      .catch(done)
  })
  it('should update o in a collection using update()  ', done => {
    testDB
      .find('user')()
      .then(records => {
        //console.log(186, records)

        testDB
          .update('user')({ name: 'Max' }, { balance: 8888 })

          .find('user')()
          .next(records => {
            // console.log(195, records)
            assert.equal(records[0].balance, 8888)
            assert.equal(records[1].balance, 8888)

            done()
          })
          .catch(done)
      })
  })
  it('should update a single document in a collection using updateOne() ', done => {
    testDB
      .find('user')()
      .then(records => {
        // console.log(209, 'before', records)
        testDB
          .updateOne('user')({ name: 'Max' }, { balance: 7777 })

          .find('user')()

          .next(records => {
            //  console.log(217, 'after', records)

            assert.equal(records[0].balance, 7777)
            assert.equal(records[1].balance, 8888)

            done()
          })
          .catch(done)
      })
  })
  it('should update or upsert a document in/into a collection using update() or upsert() ', done => {
    testDB
      .find('user')()
      .then(records => {
        //console.log(186, records)

        testDB
          .upsert('user')({ name: 'Max' }, { balance: 8888 })
          .upsert('user')({ name: 'Molly' }, { name: 'Molly', balance: 2222 })

          .find('user')()
          .next(records => {
            // console.log(195, records)
            assert.equal(records[0].balance, 8888)
            assert.equal(records[1].balance, 8888)
            assert.equal(records[3].name, 'Molly')

            done()
          })
          .catch(done)
      })
  })
  it('should update or upsert a single document in/into a collection using updateOne() or upsertOne() ', done => {
    testDB
      .find('user')()
      .then(records => {
        testDB
          .upsertOne('user')({ name: 'Max' }, { balance: 7777 })

          .upsertOne('user')({ name: 'Molly' }, { name: 'Molly', balance: 2222 })
          .find('user')()

          .next(records => {
            //  console.log(217, 'after', records)

            assert.equal(records[0].balance, 7777)
            assert.equal(records[1].balance, 8888)
            assert.equal(records[3].name, 'Molly')

            done()
          })
          .catch(done)
      })
  })
  it('should delete a single document in a collection using deleteOne() and return inserted/amended records', done => {
    testDB
      .find('user')()

      .next(function(records) {
        //console.log(233, records)
        testDB
          .deleteOne('user')({ name: 'Max' })
          //   setTimeout(function() {

          .find('user')({ name: 'Max' })
          .next(records => {
            assert.equal(records.length, 1)

            done()
          })
          .catch(done)
        //   })
      })
  })
  it('should delete multiple documents in a collection using delete() and return inserted/amended records', done => {
    testDB
      .find('user')({})
      .next(records => {
        testDB
          .deleteMany('user')({ balance: { $lt: 8900 } })

          .find('user')({})
          .next(records => {
            assert.equal(records.length, 1)
            done()
          })
          .catch(done)
      })
  })

  it('should return documents chosen with geoNear', done => {
    testDB
      .geoNear('location')(0.2, 51, { spherical: true, maxDistance: 0.1 })

      .next(result => {
        assert.deepEqual(
          result && result.results && result.results[0].obj && result.results[0].obj.city,
          'London'
        )
        assert.deepEqual(result.results && result.results.length, 1)
        done()
      })
      .catch(err => {
        console.log(292, err)
        done()
      })
  })

  it('should provide the options of a collection', done => {
    testDB.options('user').next(options => {
      assert.deepEqual(true, true)
      done()
    })
  })
  it('should close the db collection', done => {
    am.close().next(() => {
      done()
    })
  })
})
