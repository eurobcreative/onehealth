'use strict'

/*

  utilities for managing the encoding of the hchain3log personblock
  
*/

// a function that knows how to process an encoded data into hchain3log objects
// splitting by , (because the HCHAIN3 transaction family uses CSV encoding)
function deserialize(csvString) {

  // if there is no data then return nothing
  if(!csvString) return null

  // there should only be a single hchain3log at the given address
  // the HCHAIN3 transaction family specification personblocks that we should
  // be joining multiple values using the | character
  // this is a defensive move to account for accidental address collisions

  // always use the first string found - ignore the split by | part of the
  // hchain3 tp family specification for the sake of leaning
  const hchain3logString = csvString.split('|')[0]

  // split the hchain3logString into an array of parts
  const csvParts = hchain3logString.split(',')

  // return an object turning the positional values into named keyd
  return {

    // the name of the hchain3log
    name: csvParts[0],

    // the signing key used
    hchain3loghash: csvParts[1],

    // the blocknumber of the hchain1 (all persons chain)
    personblock: csvParts[2],

    // the blocknumber of the hchain2 (single person health data chain)
    specialistblock: csvParts[3],

    //  timestamp
    timestamp: csvParts[4],

    // the  command logged
    commandlog: csvParts[5],	  
  }
}

// a function that knows how to encode a of hchain3log object into the data
// string we can save back to the validator personblock tree
// this involves CSV encoding the hchain3log object
function serialize(hchain3logObject) {

  // create an array with the keys in the correct order
  const hchain3logParts = [
    hchain3logObject.name,
    hchain3logObject.hchain3loghash,
    hchain3logObject.personblock,
    hchain3logObject.specialistblock,
    hchain3logObject.timestamp,
    hchain3logObject.commandlog,	  
  ]

  // join the hchain3logParts using a comma and return that string
  return hchain3logParts.join(',')
}

// convert a base64 string into it's raw data
function fromBase64(data) {
  const buffer = new Buffer.from(data, 'base64')
	//  const buffer = new Buffer(data, 'base64')

  return buffer.toString('utf8')
}

// convert raw data into a base64 string
function toBase64(data) {
  const buffer = new Buffer.from(data)
	//  const buffer = new Buffer(data)

  return buffer.toString('base64')
}

module.exports = {
  deserialize,
  serialize,
  fromBase64,
  toBase64,
}
