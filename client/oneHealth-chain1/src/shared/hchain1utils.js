'use strict'

/*

  utility library for the HCHAIN1 transaction family

  these function might be used by both the CLI and the transaction processor
  
*/

// return a short version of the given key
function shortKey(key) {
  return key.toString().substring(0, 6)
}

// a function that prints a nice string representation of the personhash
function personToString(person){

  // replace the personhash '-' character with spaces
  const personhash = person.personhash.replace(/-/g, ' ')

  // create an array of personhash state
  const personhashSpaces = personhash.split('')

  // make an array of text lines for the output
  const parts = [
    `##################################################`,
    `NAME:     ${person.name}`,
    `HASH: ${person.personhash}`,
    `PORT OFFSET: ${person.portoffset}`,
    `##################################################`
	  
  ]	
  return parts.join("\n")
}

module.exports = {
  shortKey: shortKey,
  personToString: personToString,
}
