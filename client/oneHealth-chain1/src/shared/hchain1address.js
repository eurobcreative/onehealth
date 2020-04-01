'use strict'

/*

  library for constructing addresses for the HCHAIN1 transaction family

  HCHAIN1 tp addresses are formed using the first 6 bytes of the hash of the 
  family name (hchain1)

  Then the first 64 bytes of the hash of the person name

  You can use parts of the address to load a list of persons

  To load the data for a single person:

    NAMESPACE_HASH(6) + PERSON_NAME_HASH(64)

  To load the data for all persons:

    NAMESPACE_HASH(6)
  
*/


// import the base node crypto library for creating hashes for addresses
const crypto = require('crypto')

// the base family name for the HCHAIN1 transaction processor
const HCHAIN1_FAMILY = 'hchain1'

// the current version we are using
const HCHAIN1_VERSION = '1.0'

// utility for creating a hash of the given string using the sha512 algorithm
function createHash(st) {
  return crypto.createHash('sha512').update(st).digest('hex').toLowerCase()
}

// the NAMESPACE_HASH is the first 6 characters of the hash of the HCHAIN1_FAMILY
const HCHAIN1_NAMESPACE = createHash(HCHAIN1_FAMILY).substring(0, 6)

// address for a person is a combination of the HCHAIN1_NAMESPACE and the first
// 64 characters of the hash of the person name
function personAddress(name) {
  return HCHAIN1_NAMESPACE + createHash(name).substring(0, 64)
}

module.exports = {
  HCHAIN1_FAMILY,
  HCHAIN1_VERSION,
  HCHAIN1_NAMESPACE,
  personAddress,
}
