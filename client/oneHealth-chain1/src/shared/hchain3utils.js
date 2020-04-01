'use strict'

/*

  utility library for the HCHAIN3 transaction family

  these function might be used by both the CLI and the transaction processor
  
*/

// return a short version of the given key
function shortKey(key) {
  return key.toString().substring(0, 6)
}

// a function that prints a nice string representation of the hchain3loghash
function hchain3logToString(hchain3log){

  // replace the hchain3loghash '-' character with spaces
  const hchain3loghash = hchain3log.hchain3loghash.replace(/-/g, ' ')

  // create an array of hchain3loghash state
  const hchain3loghashSpaces = hchain3loghash.split('')

  // make an array of text lines for the output
  const parts = [
    `##################################################`,
    `NAME:     ${hchain3log.name}`,
    `HASH: ${hchain3log.hchain3loghash}`,
    `PERSONBLOCK: ${hchain3log.personblock}`,
    `SPECIALISTBLOCK: ${hchain3log.specialistblock}`,
    `TIMESTAMP: ${hchain3log.timestamp}`,
    `COMMANDLOG: ${hchain3log.commandlog}`,
    `##################################################`
	  
  ]	
  return parts.join("\n")
}

module.exports = {
  shortKey: shortKey,
  hchain3logToString: hchain3logToString,
}
