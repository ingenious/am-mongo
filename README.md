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

* .[deleteMany(collectionName)(criteria,options)](#delete-one-or-more-documents)

* .[deleteOne(collectionName)(criteria, options)](#delete-one-document)

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

### All async-methods *ExtendedPromise* methods are available to manipulate returned and rejected values

See [async-methods](https://www.npmjs.com/package/async-methods) for full API

	*Chainable methods*
	- [**next**(&lt;fn | generator | (methodName,class)&gt;)](#next)
	- [**error**(&lt;fn | generator | (methodName,class)&gt;)](#error)
	- [**forEach**(&lt;fn | generator | (methodName,class)&gt;)](#foreach)
	- [**map**(&lt;fn | generator | (methodName,class)&gt;)](#map)
	- [**mapFilter**(&lt;fn | generator | (methodName,class)&gt;)](#mapfilter)
	- [**filter**(&lt;fn | generator | (methodName,class)&gt;)](#filter)
	- [**twoPrev**(&lt;fn | generator | (methodName,class)&gt;)](#twoprev)
	- [**threePrev**(&lt;fn | generator | (methodName,class)&gt;)](#threeprev)
	- [**prev**()](#prev)

      More: [.log()](#log), [.wait()](#wait), [.timeout()](#timeout), [.catch()](#catch), [.then()](#then), [.promise()](#promise) 

## Node versions and support for async/await

**async/await** is only available from version 7.6 of node.js.  If you are using an earlier version you will not be able to use the async/await features of **async-methods**.  **async-methods** will still work for wrapping generators and classes with normal functions and generator functions in versions earlier than 7.6.

Generators have been supported in nmodejs since at lease version 4.8.7

## Handling Promise rejections

NodeJS requires all rejections in a Promise chain to be handled or an exception is thrown.
When creating chains with **am** and *ExtendedPromise* methods always have an 

```javascript
	  .error(err=>{
	
	  }) 
``` 
or 

```javascript
	  .catch(err=>{
	
	  })  
```
	  
at the end of the chain (see examples below).  That way errors will be trapped and not cause exceptions

## Install

Use versions 0.0.5 and above

```
                                                                                    
    $ npm install am-mongo@>=0.0.9 -P

```

## Usage

```javascript
                                                                                    
  let am=require('am-mongo')
    
```
or

```javascript
                                                                                    
  let am=require('async-methods')
  
  am.extend('am-mongo')
    
```
In latter case  **async-methods@0.2.15** or higher and **am-mong@0.0.14** or higher both need to be in package.json

* Can have single database conenction per application or multiple connections
* supports mongodb driver 2.3.x and 3.0.x

### am.connect() (One persistent connection)

```javascript
                                                                                    
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

```javascript
                                                                                    
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

```javascript
                                                                                    
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

```javascript
                                                                                    
     am(function*(){
         let collection= yield testDB.collection('user')
        return collection

     }).then(collection=>{


     })
     
```

### .collectionNames()

#### Retrieve an array of collection names

List a set of collection names using collectionNames()

```javascript
                                                                                    
     am(function*(){
         let collectionNames= yield testDB.collectionNames()
        return colelctionNames

     }).forEach(name=>{

         console.log(name) // 'location' 'user' 'bank'

     })
     
```

### .count()

#### Retrieve a count of documents in a collection

Get a count of records in a collection

```javascript
                                                                                    
     am(function*(){
         let n= yield testDB.count('user')()
        return n

     }).log() // 2301
     
```

### createIndex(collectionName)((keys, options)

#### Retrieve a count of documents in a collection

```javascript
                                                                                    

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

```javascript
                                                                                    
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

```javascript
                                                                                    
     testDB = am()
      .connect(url, 'test')
     testDB.next(()=>{
        db = testDB.db()
        collection = db.collection('user')
     }
     
```

### .deleteOne(collectionName)(criteria, options)

#### Delete one document

```javascript
                                                                                    
     testDB
          .deleteOne('user')({ name: 'Max' }).log()  // { n: 1, ok: 1 }
          
```

### .deleteManycollectionName)(criteria, options)

#### Delete one or more documents

```javascript
                                                                                    
        testDB.deleteMany('user')({ balance: { $lt: 8900 } })
        .log()  //  { n: 2, ok: 1 }

```

### .distinct(collectionName)()

#### Get a list of unique values for an attribute

```javascript
                                                                                    
      testDB.distinct('user')('name')
      .log()  //   [ 'Max', 'Mary' ]
      
```

### .dropCollection((collectionName))

#### drop of a collection

```javascript
                                                                                    
      testDB.dropCollection('user')
      .log()  //  true
      
```

### .findOne(collectionName)(criteria, options)

#### retrieve a single document

```javascript
                                                                                    
   testDB
      .findOne('user')({ name: 'Max' }, { projection: { name: 1, balance: 1 } })
      .log()  // { _id: 5a3b9abec6572e2a7d761420, name: 'Max', balance: 4567 }
      
```

### .find(collectionName)(criteria, options)

#### retrieve one or more documents

```javascript
                                                                                    
    testDB
      .find('user')({ name: 'Max' }, { projection: { name: 1, balance: 1 } })
      .log(137)
        //   [ { _id: 5a3b9b1cf418082a9d8a0812, name: 'Max', balance: 4567 }, 
        //       { _id: 5a3b9b1cf418082a9d8a0813, name: 'Max', balance: 1234 } ]
        
```

### .geoNear(collectionName)(x,y,options)

#### retrieve one or more documents using location proximity

```javascript
                                                                                                                                                                          
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

```javascript
                                                                                    
    testDB
      .insertOne('user')({ name: 'Max', balance: 4567 })
      .log()   //  { name: 'Max', balance: 4567, _id: 5a3b9d26cfaaae2b05ba243a }
      
```

### .insert(collectionName)(data,options)

#### insert one or more documents into a collection and return inserted records

```javascript
                                                                                    
    testDB
      .insert('user')([{ name: 'Max', balance: 1234 }, { name: 'Mary', balance: 8971 }])
      .log()
        //  [ { name: 'Max', balance: 1234, _id: 5a3b9d93169eeb2b24246bf0 },
        //    { name: 'Mary', balance: 8971, _id: 5a3b9d93169eeb2b24246bf1 } ]
        
```

### .isCollection(collectionName)

#### Check if collection exists

```javascript
                                                                                    
    testDB
      .isCollection('user')
      .next(boolean => {
        console.log(boolean) // true
      })
      
```

### options(collectionName)

#### Get options of collection

```javascript
                                                                                    
 testDB
      .options('user')
      .next(config => {
        console.log(config) // {}
      })
      
```

### .rename(collectionName)(newName)

#### Rename a collection

```javascript
                                                                                    
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

```javascript
                                                                                    
        testDB
          .updateOne('user')({ name: 'Max' }, { balance: 7777 })
          .log()    //   { n: 1, nModified: 1, ok: 1 }
          
```

### update(collectionName)(criteria, update, options)

#### Update one or more documents

```javascript
                                                                                    
        testDB
          .update('user')({ name: 'Max' }, { balance: 8888 })
          .log()    //  { n: 2, nModified: 2, ok: 1 }
          
```

### upsert(collectionName)(criteria, update, options)

#### Upsert (Amend if exists, create if not) one or more documents

```javascript
                                                                                    
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

```javascript
                                                                                    
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


## Chainable Methods for manipulating and logging data

> In all cases **fn** can be a **generator** or a normal function (for analagous synchronous operation)  An ES6 Class (anon or nameed) can be used using syntax .next(methodName,class).  This gives access to ***async/await***

An optional *tolerant* argument can be used with .map() or .filter() or with .mapFilter() to ensure completion even if there is an error


### map

#### .map(fn,tolerant)

*fn can be a normal function (synchronous operations) or a generator (asynchronous operations)*

equivalent to <array>.map().  If the previous stage of the chain resolves to an *array* or *object*, each element of the array or object is replaced with the returned result of the function or generator

#### map with function (synchronous step)

```javascript
                                                                                      
am(Promise.resolve([45, 67]))
  .map(function (item) {
    return item / 10;
  })
  
  .log('map Promise result') // map Promise result  [ 4.5, 6.7 ]​​​​​
  
  .error(err=>{      
      		// handle errors at end of chain
      
  })
  
```

####  map with anonymous class and async/await

```javascript
                                                                                      
     am([4, 5, 6])
        .map(
          'asyncMap',
          class {
            async asyncMap(value) {
              return await Promise.resolve(2 * value)
            }
          }
        )
        .map(
          'syncMap',
          class {
            syncMap(value) {
              return 3 * value
            }
          }
        )
        .log()   //  [24, 30, 36]
        
        .error(err=>{      
      		// handle errors at end of chain
         })
  
```

### filter

#### .filter(fn, tolerant)

*fn can be a normal function (synchronous operations) or a generator (asynchronous operations)   An ES6 Class (anon or named) can be used using syntax .filter(methodName,class).*

*Filter can be applied to objects and other entitites as well as arrays

#### filter with function (synchronous step)

```javascript
                                                                                      
  am(7).filter(function (value) {
    return 7 - value;
  })
  .log() // null
  .error(err=>{      
     // handle errors at end of chain
      
  })
  
```

####  filter with generator/yield

```javascript
                                                                                      
  am(7).filter(function* (value) {
     return yield(8 - value);
  })
  
  .log() // 7
  
  .error(err=>{      
      		// handle errors at end of chain
      
  })
  
```

####  fiter with async/await

```javascript
                                                                                      
     am({ a: 4, b: 5, c: 6 })
        .filter(
          'asyncMap',
          class {
            async asyncMap(value, attr) {
              return await Promise.resolve(value < 5 ? false : true)
            }
          }
        )
        .filter(
          'syncMap',
          class {
            syncMap(value, attr) {
              return value === 6 ? false : 2 * value
            }
          }
        )
        
        .log()    // {b:5}
        
        .error(err=>{      
      		// handle errors at end of chain
      
        })
  
```

#### filter with object input

```javascript
                                                                                      
  am({
      a: 27,
      b: 78
  }).filter(function* (value, attr) {

    let a = yield Promise.resolve(value);
    return a > 50;
  })
  
  .log() //   { b: 78 }​​​​​
  
  .error(err=>{      
  		// handle errors at end of chain
      
  })
  
```

### mapFilter

#### .mapFilter(fn, tolerant)

Combines a map followed by a fiter using values returned from the map
If the mapping function for an element returns false, then the element is excluded from the result

*fn can be a normal function (synchronous operations) or a generator (asynchronous operations).  An ES6 Class (anon or named) can be used using syntax .mapFilter(methodName,class).*


####  mapFilter with function (synchronous step)

```javascript
                                                                                      
     am([3, 4, 5])
       .mapFilter(function (value, i) {
         let a= 2 * value + i;
         return a > 6 ? a :false;
       })
       
       .log()     //   [ 9, 12 ]​​​​​
       
       .error(err=>{      
      		// handle errors at end of chain
      
       })
  
```

####  mapFilter with anonymous class

```javascript
                                                                                      
    am([4, 5, 6])
        .mapFilter('asyncMap', class {
            async asyncMap(value) {
              return value < 5 ? false : await Promise.resolve(2 * value)
            }
          })
        .mapFilter('syncMap', class {
            syncMap(value) {
              return value === 10 ? false : 2 * value
            }
          })
        .log()  // [24]
        
         .error(err=>{      
      		// handle errors at end of chain
      
         })
  
```

### forEach

#### .forEach(fn)

*fn can be a normal function (synchronous operations) or a generator (asynchronous operations). An ES6 Class (anon or named) can be used using syntax .forEach(methodName,class).*

forEach returns an extended Promise resolving to the initial array or objectx

#### forEach with function (synchronous step)

```javascript
                                                                                      
    am([34, 56, 78]).forEach(function (value, i) {
           console.log(value, i);
    })
    
    .log()  // 34 0, 56 1, 78 2, [34, 56, 78]
    
    .error(err=>{      
      		// handle errors at end of chain
      
    })
  
```

#### forEach with generator/yield (asynchronous steps)

```javascript
                                                                                      
  am([34, 56, 78]).forEach(function* (value, i) {
     console.log(yield am.resolve(2 * value),i);
  })
  
  .log() // 68 0, 112 1, 156 2
  
  .error(err=>{      
      // handle errors at end of chain
      
  })
  
```

#### forEach with class and async/await

```javascript
                                                                                      
    let test = []
      am(66)
        .forEach('asyncMap', class {
            async asyncMap(value, i) {
              test.push(await Promise.resolve(value))
            }
          }
        )
        
        .forEach('syncMap',class {
            syncMap(value, i) {
              test.push(2 * value)
            }
          })
          
        .next(function(){
                
            console.log(test)  // [66,132]
        })
        
        .error(err=>{      
      		// handle errors at end of chain
      
       })
  
```

#### forEach with Object input

```javascript
                                                                                      
   am({
     a: 34,
     b: 56,
     c: 78
   })
   
   .forEach(function* (value, attr) {
        console.log(yield am.resolve(3 * value), yield am.resolve(attr));
		 // ​​​​​102 'a'​​​​​, 168 'b'​​​​​, 234 'c'​​​​​ 

   })
   
   .log() // { a: 34, b: 56, c: 78 }​​​​​
   
   .error(err=>{      
      		// handle errors at end of chain
      
       })
   
  
```
### next

#### .next(fn)

*fn can be a normal function (synchronous operations) or a generator (asynchronous operations).  An ES6 Class (anon or named) can be used using syntax .next(methodName,class).*

#### next with anonymous class

```javascript
                                                                                      
     am(56)
        .next('test', class {
            async test(value) {
              return await Promise.resolve(89 + (value || 0))
            }
          })
        
        .log()    //  145
        
        .error(err=>{      
      		// handle errors at end of chain
      
       })
  
```

#### next with named class

```javascript
                                                                                      
      let sample = class {
        async test(value) {
          return await Promise.resolve(89 + (value || 0))
        }
      }
      let ep = am(56)
        
        .next('test', sample)
        
        .log()   //145
        
        .error(err=>{      
      		// handle errors at end of chain
      
       })
  
```

#### next with newed Class

```javascript
                                                                                      
    let sample = class {
        constructor(type) {
          this.type = type
        }
        async test(value) {
          return await Promise.resolve(89 + (this.type || 0) + (value || 0))
        }
      }
      let ep = am(56)
        .next('test', new sample(45))
        .next(r => {  
          console.log(r)        // 190  (45 + 89 + 56)
          
        })
        
        .error(err=>{      
      		// handle errors at end of chain
      
        })
  
```

### prev

#### .prev()

  returns *ExtendedPromise* resolving or rejecting per previous step in chain
  
The *ExtendedPromise* object keeps a reference to all previous states of the 
specific chain.  prev() uses this to allow the application logic to reverse the chain to previous states 

#### prev() after map()

```javascript
                                                                                      
                                                                                      
    let ep = am(function*() {
          yield Promise.resolve()
          return { a: 238 }
        })
        .map(function(value, attr) {
          return value * 2
        })
    
        .prev()
        
        .next(r => {
          console.log(r) // { a: 238 })
          
        })
        .error(err => {
          // handle errrors at end of chain
        })


```
#### prev() used twice


```javascript
                                                                                      
    let ep = am(function*() {
        yield Promise.resolve()
        return { a: 238, b: 56 }
      })
        .map(function(value, attr) {
          return value * 2
        })
        .filter(function(value, attr) {
          return attr === 'a' ? true : false
        })
        .prev()
        .prev()
        .next(r => {
          console.log(r) // { a: 238, b: 56 })
          
        })
        .error(err => {
          	// handle errors at end of chain
        })


```

#### prev() after map() and wait()

```javascript
                                                                                      
      let ep = am(function*() {
          yield Promise.resolve()
          return { a: 238, b: 56 }
        })
        .map(function(value, attr) {
          return value * 2
        })
        .wait(200)

        .prev()

        .next(r => {
          console.log(r) // { a: 238, b: 56 })
          
        })
        .error(err => {
          
        })

```


#### prev() after error()

```javascript
                                                                                      
 let ep = am.reject({ error: 89 })
 		  .error(()=> {
           return { b: 789 }
        })
      
        .prev()
        .error(r => {
          console.log(r) // { error: 89 })
          
        })

```    

### twoPrev

#### .twoPrev(fn)

*fn can be a normal function (synchronous operations) or a generator (asynchronous operations).  An ES6 Class (anon or named) can be used using syntax .twoPrev(methodName,class).*

#### twoPrev with function (synchronous step)

```
      let ep = am([5, 6, 7])
        .next(function(item) {
          return { a: 2 }
        })
        .next(function(item) {
          return { b: 3 }
        })
        .twoPrev((lastResult, previousResult) => {
        
        console.log(lastResult, previousResult)
          // { b: 3 } { a: 2 }

          
        })
        .error(err => {
          
        })

```

#### twoPrev wiith anonymous class

```javascript
                                                                   
      let ep = am(56)
        .next(function(item) {
          return { a: 2 }
        })
        .twoPrev(
          'test',
          class {
            async test(value, previous) {
              console.log(value,previous) // { a: 2 } 56
              return await Promise.resolve(89 + (previous || 0))
            }
          }
        )
        .next(r => {
          console.log(r) //  145
          
        })
        .error(err => {
          // handle errors
        })                                                                          
    
  
```

#### twoPrev with named class

Illustrates **Asyncronous steps in ES6 Class** pattern

```javascript

   let ep,
        sample = class {
        
        	// async method
          async test(value) {
            return await Promise.resolve(89 + (value || 0))
          }
          
          // generator method
          *result(result, previous) {
           console.log(result, previous) // 145, 56
            
          }
        }
      ep = am(56)
      
        // adds result to chain
        .next('test', sample)  
        
        // result and previous passed to result method
        .twoPrev('result', sample)         
        
        .error(err => {
        	// handle errors  
        
        })
                                                                                      
       
```
#### twoPrev with generator


```javascript
                                                              
let ep = am([5, 6, 7])

		// add result to chain
        .next(function*(item) {
          return yield { second: 897 }
        })
        .twoPrev(function*(result, prev) {
          console.log(result, prev)  //{ second: 897 }  [5, 6, 7]
        })
      
        .next(result => {
          console.log(result) // [{ second: 897 }, [5, 6, 7]]
          
        })
        .error(err => {
          // handle errors
          
        })

```


#### twoPrev with newed Class

```javascript

   let ep, 
   sample = class {
 
       constructor(type) {
          this.type = type
       }
       
       async test(value) {
         return await Promise.resolve(89 + (this.type || 0) + (value || 0))
       }
       
       *result(r, p) {
         console.log(r, p) //  190, 56
       }
   },
 
   newed = new sample(45)

      ep = am(56)
        .next('test', newed)
        .twoPrev('result', newed)
        .next(result => {
          console.log(result)  // [190, 56]
          
        })
        .error(err => {
          // handle errors
          
        })
         
```


### threePrev

#### .threePrev(fn)

*fn can be a normal function (synchronous operations) or a generator (asynchronous operations).  An ES6 Class (anon or named) can be used using syntax .twoPrev(methodName,class).*

#### threePrev with function

```
      let ep = am([5, 6, 7])
        .next(function(item) {
          return { a: 2 }
        })
        .next(function(item) {
          return { b: 3 }
        })
        .threePrev((lastResult, previousResult, previous) => {
        
           console.log(lastResult, previousResult, previous)
           // { b: 3 } { a: 2 } [5,6,7]
        })
        
        .error(err => {
        	// hanlde errors at end of chain  
        })

```

#### threePrev wiith anonymous class

```javascript
                                                                   
      let ep = am(56)
        .next(function(item) {
          return { b: 3 }
        })
        .next(function(item) {
          return { a: 2 }
        })
        .threePrev(
          'test',
          class {
            async test(value, previous, first) {
              console.log(value,previous) // { a: 2 } {b:3}  56
              return await Promise.resolve(89 + (first || 0))
            }
          }
        )
        .next(r => {
          console.log(r) //  145
          
        })
        .error(err => {
          // handle errors
        })                                                                          
    
  
```

#### threePrev with named class

Illustrates **Asyncronous steps in ES6 Class** pattern

```javascript

   let ep,
        sample = class {
        
        	// async method
          async test(value) {
            return await Promise.resolve(89 + (value || 0))
          }
          
          // generator method
          *result(result, previous, first) {
           console.log(result, previous, first) // 188, 99, 56
            
          }
        }
      ep = am(56)
      
      	  // add result to chain
        .next(r=>{
      		return 99;
        })
      
        // adds result to chain using named class
        .next('test', sample)  
        
        // result and previous passed to result method
        .threePrev('result', sample)         
        
        .error(err => {
        	// handle errors  
        
        })
        
    
                                                                                      
       
```
#### threePrev with generator


```javascript
                                                              
let ep = am([5, 6, 7])

		// add result to chain
        .next(r=>{
      		return 99;
        })

		// add result to chain
        .next(function*(item) {
          return yield { second: 897 }
        })
        .threePrev(function*(result, prev, first) {
          console.log(result, prev, first)  // { second: 897 } 99 [5, 6, 7]
        })
      
        .next(result => {
          console.log(result) // [{ second: 897 }, 99, [5, 6, 7]]
          
        })
        .error(err => {
          // handle errors
          
        })

```


#### threePrev with newed Class

```javascript

 let ep, 
 sample = class {
 
       constructor(type) {
          this.type = type
       }
       async test(value) {
         return await Promise.resolve(89 + (this.type || 0) + (value || 0))
       }
       
       *result(r, p, f) {
         console.log(r, p, f ) //  233, 99, 56
       }
 },
 
 newed = new sample(45)

      ep = am(56)
        
        // add results to chain
        .next(()=>{
      		return 99;
        })
        .next('test', newed)
        
        // invoke method with 3 previous resolved values
        .threePrev('result', newed)
        .next(result => {
          console.log(result)  // [233, 99, 56]
          
        })
        .error(err => {
          // handle errors
          
        })
            
```

### timeout

#### .timeout(ms)

```javascript
                                                                                      
    am.waterfall([
      am.resolve(999).timeout(2000),
      am.resolve(8).timeout(1000)
    ])
    
    .log() // [2002ms] [ 999, 8 ]​​​​​
    
    .error(err=>{      
      		// handle errors at end of chain
      
     })
  
```

### wait

*alias of .timeout()*

#### .wait(ms)

```javascript
                                                                                      
      am.sfFn(sf, 1).wait(3000)
      
      .log('wait')  // ​​​​​wait [3003ms] 1​​​​​
      
      .error(err=>{      
      		// handle errors at end of chain
      
       })

```
### log

#### .log(&lt;success label&gt;[,&lt;error label&gt;'[,Error()]])

*Adding* **Error()** *as last attribute will allow log to add the line number
and filename to log of success values as well as errors*

```javascript
                                                                                      
  am.sfFn(sf, 1).wait(3000)
    
    .log('with line no. ', Error());
    // ​​​​​with line no.   line 12  of async-methods/test-4.js 1​​​​​
  
    .error(err=>{      
      		// handle errors at end of chain
      
    })

```

### error

#### .error(fn)

Similar to <Promise>.catch() but by default it is 'pass-through' ie if nothing is returned - the next stage in the chain will receive the same result or error that was passed to error(fn).  

*fn can also be a normal function or a generator allowing a further chain of asyncronous operations.  An ES6 Class (anon or named) can be used using syntax .error(methodName,class).*

If the function or generator returns something other than undefined or an error occurs that result or error will be passed to the next stage of the chain.



```javascript
                                                                                      
   am.waterfall({
      a: am.reject(88),
      b: function (result, cb) {
        result.f = 567;
        cb(null, 444 + result.a);
    },
      c: function (result, cb) {
      cb(null, 444 + result.a + result.b);
     }
   })
   .error(function (err) {
     
     return am.reject(new Error('no good'))
  })
  
  .log('waterfall object', 'waterfall err')
  // ​​​​​waterfall err [Error: no good]​​​​​
  
  .error(err=>{      
      		// handle errors at end of chain
      
  })


```

### promise
                                                                                  
#### .promise()

Converts an Extended Promise to a normal promise (with methods catch and then)


```javascript
                                                                                      
   am([2, 3, 4]).next(function () {}).log()
      
      .promise()
      
      // chain is now native promise
      .then(function (result) {
      
          console.log('Promise resolves with', result);
          // Promise resolves with [2,3,4]
          
      }).catch(function (err) {
          
          // handle errors with catch() not error()
          console.log(err);
      });
   //logs
   
   
```
### then

#### .then(fn)

Similar to **<Promise>.then() but returns an Extended Promise.

If want **fn** to be a generator use **.next()**

### catch

#### .catch(fn)

Identical to **<Promise>.catch()** but returns a chainable *ExtendedPromise*.

If want **fn** to be a generator or class use **.error()**

