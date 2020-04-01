'use strict'

/*

  library for reading the state of the HCHAIN1 namespace

  we use the `/state` rest api endpoint to load data from beneath an address

  for listing persons - we load all state entries below the transaction family
  prefix

  for loading a single person - we construct an address for the specific person
  based on the prefix + person name

  for submitting a new transaction - we POST the raw binary transaction body
  to the `/batch` rest api endpoint

  each of these methods returns a promise that should be resolved by the caller
  
*/

const async = require('async')

// import the encoding library which knows how to encode and decode the
// state of a person into/from a single string
const Encoding = require('../shared/hchain1encoding')
const EncodingCH2 = require('../shared/hchain2encoding')
const EncodingCH3 = require('../shared/hchain3encoding')

// import the restapi library for communicating to the REST endpoints
const RestApi = require('./restapi')

// import the shared address library so we know what addresses to
// load state entries from
const Address = require('../shared/hchain1address')
const AddressCH2 = require('../shared/hchain2address')
const AddressCH3 = require('../shared/hchain3address')

// wait 100 milliseconds when we are waiting for a new batch submission
const WAIT_BATCH_TIME = 100

// we give the url of the rest-api to the state library
// so it can make HTTP requests to it
function State(restApiUrl) {


  // Return the last blockId commited using the HCHAIN1_NAMESPACE prefix address
  function getLastBlock() {
    return RestApi
      .getState(restApiUrl, Address.HCHAIN1_NAMESPACE)
      .then(function(body) {

	return body.head;
    })
  }


  // load the list of persons using the HCHAIN1_NAMESPACE prefix address
  function loadBlocks() {
    return RestApi
      .getBlocksAddress(restApiUrl, Address.HCHAIN1_NAMESPACE)
      .then(function(body) {


        // the body of a state response will have the an array of addresses with their state entries
        // let's map the raw person data into a processed version using the
        // encoding library
//        return [body.data] //<<-- if just wanted one single block
        return body;
        return body.data
          .map(function(block) {

            console.log("Block #"+block.header.block_num)
            console.log("   --> with batchId="+block.header.batch_ids)
            console.log("   --> and header_signature="+block.header_signature)
            console.log(block)
          
          })
      })
  }

  // load the list of persons using the HCHAIN1_NAMESPACE prefix address
  function loadPersons() {
    return RestApi
      .getState(restApiUrl, Address.HCHAIN1_NAMESPACE)
      .then(function(body) {


        // the body of a state response will have the an array of addresses with their state entries
        // let's map the raw person data into a processed version using the
        // encoding library
        return body.data
          .map(function(personStateEntry) {

            // get the raw base64 data for the state entry
            const base64Data = personStateEntry.data

            // convert it from base64 into a CSV string
            const rawPersonData = Encoding.fromBase64(base64Data)

            // convert the CSV string into a person object
            return Encoding.deserialize(rawPersonData)
          })
      })
  }

  // load a single person based on its name
  // we use the specific storage address for the person to do this
  function loadPerson(name) {
    const personAddress = Address.personAddress(name)
    return RestApi
      .getState(restApiUrl, personAddress)
      .then(function(body) {


        // the body of a state response will have the an array of addresses with their state entries
        // let's extract the data for this one person

        const personStateEntry = body.data.filter(function(entry) {
          return entry.address == personAddress
        })[0]

        if(!personStateEntry) return null

        // now let's process the person data from the raw base64 bytes we have loaded

        // get the raw base64 data for the state entry
        const base64Data = personStateEntry.data

        // convert it from base64 into a CSV string
        const rawPersonData = Encoding.fromBase64(base64Data)

        // convert the CSV string into a person object
        return Encoding.deserialize(rawPersonData)
      })
  }

  // send raw batch list bytes to the rest api
  // return the batch id once submitted
  function sendBatch(batchListBytes) {
    return RestApi
      .submitBatchList(restApiUrl, batchListBytes)
      .then(function(body) {
        // parse the link so we just return the id of the submitted batch
        const parts = body.link.split('?id=')
        return parts[1]
      })
  }

  function getBatchStatus(batchId) {
    return RestApi
      .getBatchStatus(restApiUrl, batchId)
      .then(function(body) {
        // filter the returned array down to the single status entry
        const status = body.data.filter(function(statusEntry) {
          return statusEntry.id == batchId
        })[0]
        return status
      })
  }

  // wait for the given batch to have a
  // COMMITTED or INVALID status back
  function waitBatch(batchId, done) {

    let pending = true
    let finalStatus = null

    async.whilst(
      function() {
        return pending
      },
      function(next) {
        setTimeout(function() {
          getBatchStatus(batchId)
            .then(function(batchStatus) {
              if(batchStatus.status == 'PENDING') {
                return next()
              }
              else {
                pending = false
                finalStatus = batchStatus
                return next()
              }
            })
            .catch(next)
        }, WAIT_BATCH_TIME)
      },
      function(error) {
        if(error) return done(error)
        return done(null, finalStatus)
      }
    )
  }

  return {
    loadPersons: loadPersons,
    loadPerson: loadPerson,
    sendBatch: sendBatch,
    waitBatch: waitBatch,
    getLastBlock:getLastBlock,
    loadBlocks:loadBlocks,    
  }
}

module.exports = State
