'use strict'

/*

  library for constructing addresses for the HCHAIN3 transaction family

  HCHAIN3 tp addresses are formed using the first 6 bytes of the hash of the 
  family name (hchain3)

  Then the first 64 bytes of the hash of the hchain3log name

  You can use parts of the address to load a list of hchain3logs

  To load the data for a single hchain3log:

    NAMESPACE_HASH(6) + HCHAIN3LOG_NAME_HASH(64)

  To load the data for all hchain3logs:

    NAMESPACE_HASH(6)
  
*/


// import the base node crypto library for creating hashes for addresses
const crypto = require('crypto')

// the base family name for the HCHAIN3 transaction processor
const HCHAIN3_FAMILY = 'hchain3'

// the current version we are using
const HCHAIN3_VERSION = '1.0'

// utility for creating a hash of the given string using the sha512 algorithm
function createHash(st) {
  return crypto.createHash('sha512').update(st).digest('hex').toLowerCase()
}

// the NAMESPACE_HASH is the first 6 characters of the hash of the HCHAIN3_FAMILY
const HCHAIN3_NAMESPACE = createHash(HCHAIN3_FAMILY).substring(0, 6)

// address for a hchain3log is a combination of the HCHAIN3_NAMESPACE and the first
// 64 characters of the hash of the hchain3log name
function hchain3logAddress(name) {
  return HCHAIN3_NAMESPACE + createHash(name).substring(0, 64)
}

module.exports = {
  HCHAIN3_FAMILY,
  HCHAIN3_VERSION,
  HCHAIN3_NAMESPACE,
  hchain3logAddress,
}
