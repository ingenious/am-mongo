let am,
  asyncMethods = require('async-methods'),
  MongoClient = require('mongodb').MongoClient

class ExtendedPromise extends asyncMethods.ExtendedPromise {
  constructor(fn, context) {
    super(fn, context)

    let self = this
    this._state_ = context || {}
    this._state_.timer = this._state_.timer || +new Date()
    this._state_.prev = this._state_.prev || null
  }
  close() {
    let self = this,
      newContext = this._state_
    delete newContext.db

    // delete newContext.client

    return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
      let client = newContext.client()
      if (client) {
        //console.log('closing connection')
        am(client.close())
          .next(resolve)
          .error(reject)
      }
    })
  }

  connect(url, database) {
    let self = this,
      dbValue,
      clientValue,
      newContext = this._state_
    if (url.indexOf('mongodb') !== 0 && url.indexOf('://') === -1) {
      url = 'mongodb://' + url
    }
    newContext.db = function() {
      return dbValue
    }
    newContext.client = function() {
      return clientValue
    }
    newContext.prev = this
    return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
      MongoClient.connect(url).then(function(client) {
        let db
        if (client.constructor.name === 'MongoClient') {
          db = client.db(database)
        } else {
          db = client
        }
        dbValue = db
        clientValue = client
        resolve(db)
      })
    })
  }

  db() {
    let self = this,
      newContext = this._state_,
      db = self._state_ && self._state_.db && self._state_.db()

    return db || null
  }

  client() {
    let self = this,
      client = self._state_ && self._state_.client && self._state_.client()
    return client || null
  }

  collections() {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
      let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db

      self._state_.prev = self
      if (!db) {
        reject('Database not connected')
      }
      am(db.collections())
        .next(collections => resolve(collections))
        .error(reject)
    })
  }
  collection(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
      let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db

      self._state_.prev = self
      if (!db) {
        reject('Database not connected')
      }
      resolve(db.collection(collectionName))
    })
  }
  collectionNames() {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
      let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db

      self._state_.prev = self

      if (!db) {
        reject('Database not connected')
      }
      am(db.collections())
        .map(function(collection) {
          return collection.collectionName
        })
        .next(names => resolve(names))
        .catch(reject)
    })
  }

  count(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
      let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
      self._state_.prev = self
      if (!db) {
        reject('Database not connected')
      }
      if (!collectionName) {
        return self.then(function(oldResult) {
          if (err) {
            reject(err)
          }
          if (oldResult === undefined || oldResult === null) {
            resolve(0)
          } else if (oldResult.length !== undefined) {
            resolve(result.length)
          } else {
            resolve(1)
          }
        })
      } else if (db && db.collection(collectionName)) {
        return self.then(function() {
          am(db.collection(collectionName).count())
            .next(resolve)
            .error(reject)
        })
      } else {
        reject('Database not connected or invalid collection name')
      }
    })
  }

  createIndex(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return function(keys, options = {}) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
        self._state_.prev = self
        if (!db) {
          reject('Database not connected')
        }

        am(db.collection(collectionName).createIndex(keys, options))
          .next(result => resolve(result))
          .catch(reject)
      })
    }
  }

  deleteMany(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return function(criteria, options = {}) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db

        self._state_.prev = self

        if (!db) {
          reject('Database not connected')
        }

        am(db.collection(collectionName).deleteMany(criteria, options))
          .next(result => resolve(result.result))
          .catch(reject)
      })
    }
  }
  deleteOne(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return function(criteria, options = {}) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
        self._state_.prev = self
        if (!db) {
          reject('Database not connected')
        }

        am(db.collection(collectionName).deleteOne(criteria, options))
          .next(result => resolve(result.result))
          .catch(reject)
      })
    }
  }

  distinct(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return function(attr, options = {}) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db

        self._state_.prev = self

        if (!db) {
          reject('Database not connected')
        }

        am(db.collection(collectionName).distinct(attr, options))
          .next(result => resolve(result))
          .catch(reject)
      })
    }
  }

  dropCollection(collection) {
    let self = this,
      newContext = this._state_
    newContext.prev = this

    return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
      let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db

      if (!db) {
        return asyncMethods.reject('Database not connected')
      }
      am(db.dropCollection(collection)).next(result => resolve(result))
    })
  }
  findOne(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this

    // in later versions of nodejs driver field selection is made with
    // { projection: {..fields..}} in options parameter
    return function(criteria, options = {}) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
        self._state_.prev = self
        if (!db) {
          reject('Database not connected')
        }

        am(db.collection(collectionName).findOne(criteria, options))
          .next(result => resolve(result))
          .catch(reject)
      })
    }
  }

  find(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this

    // in later versions of nodejs driver field selection is made with
    // { projection: {..fields..}} in options parameter
    return function(criteria, options = {}) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
        self._state_.prev = self
        if (!db) {
          reject('Database not connected')
        }

        am(
          db
            .collection(collectionName)
            .find(criteria, options)
            .toArray()
        )
          .next(result => resolve(result))
          .catch(reject)
      })
    }
  }

  geoNear(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return function(x, y, options) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
        self._state_.prev = self
        if (!db) {
          reject('Database not connected')
        }

        am(db.collection(collectionName).geoNear(x, y, options))
          .next(result => resolve(result))
          .catch(reject)
      })
    }
  }

  insert(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return function(data, options = {}) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
        self._state_.prev = self
        if (!db) {
          reject('Database not connected')
        }

        db.collection(collectionName).insert(data, options, function(err, r) {
          if (err) {
            reject(err)
          } else {
            resolve(r.result.ok && r.result.n ? r.ops : null)
          }
        })
      })
    }
  }

  insertOne(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return function(data) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
        self._state_.prev = self
        if (!db) {
          reject('Database not connected')
        }

        db.collection(collectionName).insertOne(data, function(err, r) {
          if (err) {
            reject(err)
          } else {
            resolve(r.result.ok && r.result.n ? r.ops[0] : null)
          }
        })
      })
    }
  }

  isCollection(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this

    return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
      let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
      self._state_.prev = self
      if (!db) {
        reject('Database not connected')
      }

      am(
        db.listCollections({ name: collectionName }).next(function(err, r) {
          resolve(r ? true : false)
        })
      ).catch(reject)
    })
  }

  options(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this

    return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
      let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
      self._state_.prev = self
      if (!db) {
        reject('Database not connected')
      }
      am(db.collection(collectionName).options())
        .next(result => resolve(result))
        .error(reject)
    })
  }

  rename(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return function(newName, options = {}) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
        self._state_.prev = self
        if (!db) {
          reject('Database not connected')
        }
        am(db.collection(collectionName).rename(newName, options))
          .next(result => resolve(result))
          .error(reject)
      })
    }
  }
  update(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return function(filter = {}, update = {}, options = {}) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
        self._state_.prev = self
        if (!db) {
          reject('656 Database not connected')
        }
        options.multi = true
        am(db.collection(collectionName).update(filter, { $set: update }, options))
          .next(result => resolve(result.result))
          .error(reject)
      })
    }
  }
  updateOne(collectionName) {
    let self = this,
      newContext = this._state_
    newContext.prev = this
    return function(filter = {}, update = {}, options = {}) {
      return am.ExtendedPromise._chain(self, newContext)(function(resolve, reject, result, err) {
        let db = self._state_ && self._state_.db ? self._state_.db() : ExtendedPromise.prototype.db
        self._state_.prev = self
        if (!db) {
          reject('Database not connected')
        }

        am(db.collection(collectionName).update(filter, { $set: update }, options))
          .next(result => resolve(result.result))
          .error(reject)
      })
    }
  }

  upsert(collectionName) {
    let self = this
    return function(filter, update = {}, options = {}) {
      options.upsert = true
      return self.next(function() {
        return self.update(collectionName)(filter, update, options)
      })
    }
  }
  upsertOne(collectionName) {
    let self = this
    return function(filter, update = {}, options = {}) {
      options.upsert = true
      return self.next(function() {
        return self.updateOne(collectionName)(filter, update, options)
      })
    }
  }
}

// back extend async methods ExtendedPromise class
am = asyncMethods._extend(ExtendedPromise)

// new static methods
am.connect = function(url, database, mongodb) {
  // http://mongodb.github.io/node-mongodb-native/2.2/reference/connecting/connection-settings/
  if (mongodb) {
    MongoClient = mongodb.MongoClient
  }
  if (url.indexOf('mongodb') !== 0 && url.indexOf('://') === -1) {
    url = 'mongodb://' + url
  }

  return am(
    MongoClient.connect(url).then(function(client) {
      if (client.constructor.name === 'MongoClient') {
        db = client.db(database)
      } else {
        db = client
      }
      db.on('close', function() {
        ExtendedPromise.prototype.db = null
      })
      am.client = ExtendedPromise.prototype.client = client
      am.db = ExtendedPromise.prototype.db = db

      return db
    })
  )
}
am.close = function() {
  let self = this,
    client = ExtendedPromise.prototype.client

  if (db) {
    delete ExtendedPromise.prototype.db
    delete am.db
    delete ExtendedPromise.prototype.client
    return am(client.close())
  }
  return null
}

module.exports = am

// These mongo methods not supported

//geoHaystackSearch

//createIndexes
//dropAllIndexes
//dropIndex
//dropIndexes
//indexes
//indexExists
//indexInformation
//listIndexes
//reIndex

// aggregate
// group
// bulkWrite
// geoHaystackSearch
// initializeOrderedBulkOp
// initializeUnorderedBulkOp
// parallelCollectionScan
// isCapped
// mapReduce
// save
// statscollection
// replaceOne
// findAndModify
// findAndRemove
// findOneAndDelete
// findOneAndReplace
// findOneAndUpdate
