# AM-MONGO (async-methods mongo extension)

> Conveniently-wrapped Mongo collections methods returning ExtendedPromises with **_async-methods_** methods available

#### This extension has the following methods:

* .connect(url, databaseName)

* .collections()

* .collection(collectionName)

* .collectionNames()

* .count()

* .createIndex(collectionName)(keys, options)

* .client()

* .db()

* .deleteMany(collectionName)(criteria,options)

* .deleteOne(collectionName)(criteria, options)

* .distinct(collectionName)(field,options)

* .dropCollection(collectionName)

* .findOne(collectionName)(criteria, options)

* .find(collectionName)(criteria, options)

* .geoNear(collectionName)(x,y,options)

* .insert(collectionName)(data,options)

* .insertOne(collectionName)(data,options)

* .isCollection(collectionName)

* .options(collectionName)

* .rename(collectionName)(newName)

* .update(collectionName)(criteria, update, options)

* .updateOne(collectionName)(criteria, update, options)

* .upsert(collectionName)(criteria, update, options)

* .upsertOne(collectionName)(criteria, update, options)

### All async-methods' ExtendedPromise methods are available on returned and rejected values

See [async-methods](https://www.npmjs.com/package/async-methods) for full API

* .forEach())

* .map()

* .mapFilter()

* .filter()

* .next())

* .error()

* .prev()

* .timeout()

* .wait()

* .promise()

* .log()

* .then()

* .catch()

## Install

```

    $ npm install am-mongo -P
```

## Usage

```


    let am=require('am-mongo')
    
```

* Can have single database conenction per application or multiple connections
* supports mongodb driver 2.3.x and 3.0.x

### am.connect() (One persistent connection)

```
                                                                                      
    // pass url of database and name of dataase to connect()

    testDB = am.connect('dbadmin:Mongo$789@192.168.99.100:27017', 'test').then(db => {

        // db is available once connected

    })

   // or use testDB
        testDB.collections().then(list=>{

            console.log(list)
            // ['location','user']
        })

    am.close()  // closes the connection
    
```

The same connection will be available in any new chain initiated with am even in sparate modules, so can be used throughout an application.

If needed **db** and **MongoClient** are available any time as **_am.db_** and **_am.client_**

### am().connect() (Separate Connection for lifetime of a chain)

```
                                                                                      
    // pass url of database and name of dataase to connect()
	testDB = am().connect(url, 'test').then(db => {

        // db is available once connected


    })

     // or use testDB (Extended Promise)
        testDB.collections().then(list=>{

            console.log(list)
            // ['location','user']
        })

    testDB.db() // reference to native db object (for other methods if needed)
    testDB.client() // reference to native MongoClient object (for other functions if needed)

    testDB.close()  // close the connection
    
```

If needed **db** and **MongoClient** are available any time as **_testDB.db()_** and **_testDB.client()_**

### .collections()

#### List a set of collection objects

An array of collections is resolved in by the returned ExtendedPromise

```
                                                                                      
 testDB
      .collections()
      .map(collection => {
        return collection.collectionName
      }).next(names=>{
          console.log(names)
          // ['location','user','account']
      })
      
```

### .collection(collectionName)

#### Retrieve a collection object

```
                                                                                      
     am(function*(){
         let collection= yield testDB.collection('user')
        return collection

     }).then(collection=>{


     })
     
```

### .collectionNames()

#### Retrieve an array of collection names

List a set of collection names using collectionNames()

```
                                                                                      
     am(function*(){
         let collectionNames= yield testDB.collectionNames()
        return colelctionNames

     }).forEach(name=>{

         console.log(name) // 'location' 'user' 'bank'

     })
     
```

### .count()

#### Retrieve a count of docuements in a collection

Get a count of records in a collection

```
                                                                                      
     am(function*(){
         let n= yield testDB.count('user')()
        return n

     }).log() // 2301
     
```

### createIndex(collectionName)((keys, options)

#### Retrieve a count of docuements in a collection

```
                                                                                      
     am(function*(){
        return yield testDB.insert('location')({
                city: 'London',
                postcode: 'W1A 7YT',
                geo: {
                  type: 'Point',
                  coordinates: [-0.2416813, 51.5285582]
                }
              })
              yield testDB.insert('location')({
                city: 'New York',
                postcode: '3456783',
                geo: {
                  type: 'Point',
                  coordinates: [-73.856077, 40.848447]
                }
              })
         testDB.createIndex('location')({ geo: '2dsphere' })

     }).next(result=>{

         console.log('result')  // 'geo_2dsphere'

     }).catch(err=>{

     })
     
```

### .client()

#### Returns reference to nodeJS driver native MongoClient object

NB: This returns when using single chain connection method (**_am().connect()_**)
This method returns a MongoClient object not an ExtendedPromise

```
                                                                                      
     testDB = am().connect(url, 'test')

     testDB.next(()=>{
        client = testDB.client()
        client.close()

     }
     
```

### .db()

#### Returns reference to nodeJS driver native database object

NB: This returns when using single chain connection method (**_am().connect()_**)
This method returns a DB object not an ExtendedPromise

```
                                                                                      
     testDB = am()
      .connect(url, 'test')
     testDB.next(()=>{
        db = testDB.db()
        collection = db.collection('user')
     }
     
```

### .deleteOne(collectionName)(criteria, options)

#### Delete one document

```
                                                                                      
     testDB
          .deleteOne('user')({ name: 'Max' }).log()  // { n: 1, ok: 1 }
          
```

### .deleteManycollectionName)(criteria, options)

#### Delete one or more documents

```
                                                                                      
        testDB.deleteMany('user')({ balance: { $lt: 8900 } })
        .log()  //  { n: 2, ok: 1 }

```

### .distinct(collectionName)()

#### Get a list of unique values for an attribute

```
                                                                                      
      testDB.distinct('user')('name')
      .log()  //   [ 'Max', 'Mary' ]
      
```

### .dropCollection((collectionName))

#### drop of a collection

```
                                                                                      
      testDB.dropCollection('user')
      .log()  //  true
      
```

### .findOne(collectionName)(criteria, options)

#### retrieve a single document

```
                                                                                      
   testDB
      .findOne('user')({ name: 'Max' }, { projection: { name: 1, balance: 1 } })
      .log()  // { _id: 5a3b9abec6572e2a7d761420, name: 'Max', balance: 4567 }
      
```

### .find(collectionName)(criteria, options)

#### retrieve one or more documents

```
                                                                                      
    testDB
      .find('user')({ name: 'Max' }, { projection: { name: 1, balance: 1 } })
      .log(137)
        //   [ { _id: 5a3b9b1cf418082a9d8a0812, name: 'Max', balance: 4567 }, 
        //       { _id: 5a3b9b1cf418082a9d8a0813, name: 'Max', balance: 1234 } ]
        
```

### .geoNear(collectionName)(x,y,options)

#### retrieve one or more documents using location proximity

```
                                                                                      
  testDB
      .geoNear('location')(0.2, 51, { spherical: true, maxDistance: 0.1 })
      .log()

      /*
       { results: [
           { dis: 0.010410013646823974,
             obj: { _id: 5a3b9c6888b43f2adddc85c1,
                    city: 'London',
                    postcode: 'W1A 7YT',
                    geo: { type: 'Point', coordinates: [Array] }
             }
         }],
         stats: { nscanned: 3,
                  objectsLoaded: 1,
                  avgDistance: 0.010410013646823974,
                  maxDistance: 0.010410013646823974,
                  time: 0
                },
         ok: 1 }
     */
     
```

### .insertOne(collectionName)(data,options)

#### insert one document into a collection and return inserted record

```
                                                                                      
    testDB
      .insertOne('user')({ name: 'Max', balance: 4567 })
      .log()   //  { name: 'Max', balance: 4567, _id: 5a3b9d26cfaaae2b05ba243a }
      
```

### .insert(collectionName)(data,options)

#### insert one or more documents into a collection and return inserted records

```
                                                                                      
    testDB
      .insert('user')([{ name: 'Max', balance: 1234 }, { name: 'Mary', balance: 8971 }])
      .log()
        //  [ { name: 'Max', balance: 1234, _id: 5a3b9d93169eeb2b24246bf0 },
        //    { name: 'Mary', balance: 8971, _id: 5a3b9d93169eeb2b24246bf1 } ]
        
```

### .isCollection(collectionName)

#### Check if collection exists

```
                                                                                      
    testDB
      .isCollection('user')
      .next(boolean => {
        console.log(boolean) // true
      })
      
```

### options(collectionName)

#### Get options of collection

```
                                                                                      
 testDB
      .options('user')
      .next(config => {
        console.log(config) // {}
      })
      
```

### .rename(collectionName)(newName)

#### Rename a collection

```
                                                                                      
 testDB
      .rename('balance')('bank')
      .next(function*(collection) {
        let banks = yield testDB.find('bank')(),
          balances = yield testDB.find('balance')()
        console.log(collection.collectionName,balances.length,banks.length)  //  'bank', 0, 2

      })
      
```

### updateOne(collectionName)(criteria, update, options)

#### Update one document

```
                                                                                      
        testDB
          .updateOne('user')({ name: 'Max' }, { balance: 7777 })
          .log()    //   { n: 1, nModified: 1, ok: 1 }
          
```

### update(collectionName)(criteria, update, options)

#### Update one or more documents

```
                                                                                      
        testDB
          .update('user')({ name: 'Max' }, { balance: 8888 })
          .log()    //  { n: 2, nModified: 2, ok: 1 }
          
```

### upsert(collectionName)(criteria, update, options)

#### Upsert (Amend if exists, create if not) one or more documents

```
                                                                                      
        testDB
          .upsert('user')({ name: 'Max' }, { balance: 8888 })
          .upsert('user')({ name: 'Molly' }, { name: 'Molly', balance: 2222 })
          .log()
          //    { n: 1, nModified: 0,  
          //      upserted: [ { index: 0, _id: 5a3ba7201c12d25fdd112353 } ],
          //      ok: 1 }
          
```

### upsertOne(collectionName)(criteria, update, options)

#### Upsert (Amend if exists, create if not) one document

```
                                                                                      

        testDB
          .upsertOne('user')({ name: 'Max' }, { balance: 7777 })
          .log()  // { n: 1, nModified: 1, ok: 1 }
          
```

## Tests

There are 210 automated tests for this extension in **_/tests_**. The test suites illustrate repeated operations on same database.

```
                                                                                      
    $  npm test

    # test mongo methods only
    $ npm run test-mongo

    # test base async-methods methods (ExtendedPromise methods)
    $ npm run test-am
    
```
