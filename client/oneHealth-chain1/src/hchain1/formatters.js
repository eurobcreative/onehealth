'use strict'

// import a library for making CLI tables
const Table = require('table')

// import the shared utils for making short keys
const sharedUtils = require('../shared/hchain1utils')

/*

  format various data structures into text output

  if we are using JSON output - this is not needed as we print raw data
  
*/

// output the array of persons as a CLI table
function listPersonsTable(persons) {
const titles = ['NAME', 'HASH','PORTOFFSET']	
  const personData = persons.map(function(person){
    return [
      person.name,
      person.personhash,
      person.portoffset,
    ]
  })
	
  const data = [titles].concat(personData)
  return Table.table(data, {
    border: Table.getBorderCharacters('norc')
  })
}

// pretty print a single person
function personToString(person) {
  return sharedUtils.personToString(person)
}

// print the raw JSON to stdout
function asJson(data) {
  return JSON.stringify(data, null, 4)
}

// print a submitted transaction status
function submittedBatch(data) {
  const parts = [
    `batch id:             ${data.id}`,
    `status:               ${data.status}`,
  ]

  if(data.invalid_transactions.length > 0) {
    parts.push(`invalid transactions: ${data.invalid_transactions.length}`)

    data.invalid_transactions.forEach(function(invalidTransaction) {
      parts.push('')
      parts.push(`transaction id:       ${invalidTransaction.id}`)
      parts.push(`message:              ${invalidTransaction.message}`)
    })
  }

  return parts.join("\n")
}

module.exports = {
  listPersonsTable: listPersonsTable,
  personToString: personToString,
  asJson: asJson,
  submittedBatch: submittedBatch,
}
