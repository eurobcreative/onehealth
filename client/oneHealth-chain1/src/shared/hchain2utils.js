'use strict'

/*

  utility library for the HCHAIN2 transaction family

  these function might be used by both the CLI and the transaction processor
  
*/

// return a short version of the given key
function shortKey(key) {
  return key.toString().substring(0, 6)
}

// a function that prints a nice string representation of the personblock
function personToString(person){

  // replace the personblock '-' character with spaces
  const personblock = person.personblock.replace(/-/g, ' ')

  // create an array of personblock state
  const personblockSpaces = personblock.split('')

  // make an array of text lines for the output
  const parts = [
    `##################################################`,
    `NAME:     ${person.name}`,
    `HASH: ${person.personblock}`, 
    `BLOODTYPE:     ${person.bloodtype}`,
    `BIOSEX:     ${person.biosex}`,
    `BIRTHDAY:     ${person.birthday}`,
    `CALORIES: ${person.calories}`,
    `BODYMASSIDX: ${person.bodymassindex}`,
    `HEIGHT: ${person.height}`,	  
    `WEIGHT: ${person.weight}`,
    `STEPS: ${person.stepcount}`,
    `DISTANCE: ${person.distancewalkingrunning}`,
    `SLEEP: ${person.sleepdata}`,
    `HEARTRATE: ${person.heartrate}`,
    `O2SATURATION: ${person.oxigensaturation}`,
    `TEMPERATURE: ${person.bodytemperature}`,
    `BLOODPRESSURE: ${person.bloodpressure}`,
    `BLOODSUGAR: ${person.bloodsugar}`,	  
    `##################################################`
	  
  ]	
  return parts.join("\n")
}

module.exports = {
  shortKey: shortKey,
  personToString: personToString,
}
