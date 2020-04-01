'use strict'

/*

  library for reading the state of the HCHAIN3 namespace

  we use the `/state` rest api endpoint to load data from beneath an address

  for listing hchain3logs - we load all state entries below the transaction family
  prefix

  for loading a single hchain3log - we construct an address for the specific hchain3log
  based on the prefix + hchain3log name

  for submitting a new transaction - we POST the raw binary transaction body
  to the `/batch` rest api endpoint

  each of these methods returns a promise that should be resolved by the caller
  
*/

const async = require('async')

// import the encoding library which knows how to encode and decode the
// state of a hchain3log into/from a single string
const Encoding = require('../shared/hchain3encoding')

// import the restapi library for communicating to the REST endpoints
const RestApi = require('./restapi')

// import the shared address library so we know what addresses to
// load state entries from
const Address = require('../shared/hchain3address')

// wait 100 milliseconds when we are waiting for a new batch submission
const WAIT_BATCH_TIME = 100

// we give the url of the rest-api to the state library
// so it can make HTTP requests to it
function State(restApiUrl) {

  // load the list of hchain3logs using the HCHAIN3_NAMESPACE prefix address
  function loadHChain3Logs() {
    return RestApi
      .getState(restApiUrl, Address.HCHAIN3_NAMESPACE)
      .then(function(body) {

        // the body of a state response will have the an array of addresses with their state entries
        // let's map the raw hchain3log data into a processed version using the
        // encoding library
        return body.data
          .map(function(hchain3logStateEntry) {

            // get the raw base64 data for the state entry
            const base64Data = hchain3logStateEntry.data

            // convert it from base64 into a CSV string
            const rawHChain3LogData = Encoding.fromBase64(base64Data)

            // convert the CSV string into a hchain3log object
            return Encoding.deserialize(rawHChain3LogData)
          })
      })
  }

  // load a single hchain3log based on its name
  // we use the specific storage address for the hchain3log to do this
  function loadHChain3Log(name) {
    const hchain3logAddress = Address.hchain3logAddress(name)
    return RestApi
      .getState(restApiUrl, hchain3logAddress)
      .then(function(body) {

        // the body of a state response will have the an array of addresses with their state entries
        // let's extract the data for this one hchain3log

        const hchain3logStateEntry = body.data.filter(function(entry) {
          return entry.address == hchain3logAddress
        })[0]

        if(!hchain3logStateEntry) return null

        // now let's process the hchain3log data from the raw base64 bytes we have loaded

        // get the raw base64 data for the state entry
        const base64Data = hchain3logStateEntry.data

        // convert it from base64 into a CSV string
        const rawHChain3LogData = Encoding.fromBase64(base64Data)

        // convert the CSV string into a hchain3log object
        return Encoding.deserialize(rawHChain3LogData)
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
    loadHChain3Logs: loadHChain3Logs,
    loadHChain3Log: loadHChain3Log,
    sendBatch: sendBatch,
    waitBatch: waitBatch,
  }
}

module.exports = State
