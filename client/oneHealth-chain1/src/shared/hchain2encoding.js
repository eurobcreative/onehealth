'use strict'

/*

  utilities for managing the encoding of the person height
  
*/

// a function that knows how to process an encoded data into person objects
// splitting by , (because the HCHAIN2 transaction family uses CSV encoding)
function deserialize(csvString) {

  // if there is no data then return nothing
  if(!csvString) return null

  // there should only be a single person at the given address
  // the HCHAIN2 transaction family specification heights that we should
  // be joining multiple values using the | character
  // this is a defensive move to account for accidental address collisions

  // always use the first string found - ignore the split by | part of the
  // hchain2 tp family specification for the sake of leaning
  const personString = csvString.split('|')[0]

  // split the personString into an array of parts
  const csvParts = personString.split(',')

  // return an object turning the positional values into named keyd
  return {

    // the name of the person
    name: csvParts[0],

    // the blocknumber of the hchain1 (all persons chain)
    personblock: csvParts[1],

    // calories
    calories: csvParts[2],

    // bodymassindex
    bodymassindex: csvParts[3],

    // height of the person
    height: csvParts[4],

    // weight
    weight: csvParts[5],

    // stepcount
    stepcount: csvParts[6],

    // distancewalkingrunning
    distancewalkingrunning: csvParts[7],

    // sleepdata
    sleepdata: csvParts[8],

    // heartrate
    heartrate: csvParts[9],

    // oxigensaturation
    oxigensaturation: csvParts[10],

    // bodytemperature
    bodytemperature: csvParts[11],	  

    // bloodpressure
    bloodpressure: csvParts[12],

    // bloodsugar
    bloodsugar: csvParts[13],	  

    // bloodtype
    bloodtype: csvParts[14],

    // biosex
    biosex: csvParts[15],

    // birthday
    birthday: csvParts[16],	  
  }
}

// a function that knows how to encode a of person object into the data
// string we can save back to the validator height tree
// this involves CSV encoding the person object
function serialize(personObject) {

  // create an array with the keys in the correct order
  const personParts = [
    personObject.name,
    personObject.personblock,
    personObject.calories,
    personObject.bodymassindex,
    personObject.height,
    personObject.weight,
    personObject.stepcount,
    personObject.distancewalkingrunning,
    personObject.sleepdata,
    personObject.heartrate,
    personObject.oxigensaturation,
    personObject.bodytemperature,
    personObject.bloodpressure,
    personObject.bloodsugar,
      personObject.bloodtype,
      personObject.biosex,
      personObject.birthday, 	  
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
