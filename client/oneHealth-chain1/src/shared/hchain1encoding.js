'use strict'

/*

  utilities for managing the encoding of the person portoffset
  
*/

// a function that knows how to process an encoded data into person objects
// splitting by , (because the HCHAIN1 transaction family uses CSV encoding)
function deserialize(csvString) {

  // if there is no data then return nothing
  if(!csvString) return null

  // there should only be a single person at the given address
  // the HCHAIN1 transaction family specification portoffsets that we should
  // be joining multiple values using the | character
  // this is a defensive move to account for accidental address collisions

  // always use the first string found - ignore the split by | part of the
  // hchain1 tp family specification for the sake of leaning
  const personString = csvString.split('|')[0]

  // split the personString into an array of parts
  const csvParts = personString.split(',')

  // return an object turning the positional values into named keyd
  return {

    // the name of the person
    name: csvParts[0],

    // the current representation of the personhash
    personhash: csvParts[1],

    // the current portoffset of the person
    portoffset: csvParts[2],

  }
}

// a function that knows how to encode a of person object into the data
// string we can save back to the validator portoffset tree
// this involves CSV encoding the person object
function serialize(personObject) {

  // create an array with the keys in the correct order
  const personParts = [
    personObject.name,
    personObject.personhash,
    personObject.portoffset,
  ]

  // join the personParts using a comma and return that string
  return personParts.join(',')
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
