'use strict'

/*

  low level library for communicatiog with the restapi server

  this is used to speak to the following endpoints:

   * `/state` - read data entries under a given address
   * `/batches` - used to submit new transactions
   * `/batch_statuses` - used to read the status of new batches
  
  each of these methods will return a promise that should be resolved
  by the caller
*/

// import the base HTTP library
const axios = require('axios')

// load the state entries under a given address
function getState(restApiUrl, address) {
  return axios
    .get(`${restApiUrl}/state?address=${address}`)
    .then(function(response) {
      return response.data
    })
}

// get the status of a given batch id
function getBatchStatus(restApiUrl, batchId) {
  return axios
    .get(`${restApiUrl}/batch_statuses?id=${batchId}`)
    .then(function(response) {
      return response.data
    })
}

// submit a new transaction
// the payload is the raw HTTP body to send to the validator (via the rest api)
function submitBatchList(restApiUrl, batchListBytes) {
  return axios
    .post(`${restApiUrl}/batches`, batchListBytes, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    })
    .then(function(response) {
      return response.data
    })
}


// get the block data of a given block id
function getBlockStatus(restApiUrl, blockId) {
  return axios
    .get(`${restApiUrl}/blocks/${blockId}`)
    .then(function(response) {
      return response.data
    })
}


// load the blocks entries under a given address
function getBlocksAddress(restApiUrl, address) {
  return axios
    .get(`${restApiUrl}/blocks?address=${address}`)
    .then(function(response) {
      return response.data
    })
}
// get ALL the blocks 
function getAllBlocks(restApiUrl) {
  return axios
    .get(`${restApiUrl}/blocks`)
    .then(function(response) {
      return response.data
    })
}




module.exports = {
  getState: getState,
  getBatchStatus: getBatchStatus,
  submitBatchList: submitBatchList,
  getBlockStatus:getBlockStatus,
  getBlocksAddress:getBlocksAddress,
  getAllBlocks:getAllBlocks,
}
