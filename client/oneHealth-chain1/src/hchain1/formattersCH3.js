'use strict'

// import a library for making CLI tables
const Table = require('table')

// import the shared utils for making short keys
const sharedUtils = require('../shared/hchain3utils')

/*

  format various data structures into text output

  if we are using JSON output - this is not needed as we print raw data
  
*/

// output the array of hchain3logs as a CLI table
function listHChain3LogsTable(hchain3logs) {
  const titles = ['NAME', 'HASH','CHAIN1_ID', 'CHAIN2_ID', 'TIMESTAMP/AUTH', 'COMMANDLOG']
  const hchain3logData = hchain3logs.map(function(hchain3log){
    return [
      hchain3log.name,
      hchain3log.hchain3loghash,
      hchain3log.personblock,
      hchain3log.specialistblock,
      hchain3log.timestamp,
      hchain3log.commandlog,	    
    ]
  })

  const data = [titles].concat(hchain3logData)
  return Table.table(data, {
    border: Table.getBorderCharacters('norc')
  })
}

// pretty print a single hchain3log
function hchain3logToString(hchain3log) {
  return sharedUtils.hchain3logToString(hchain3log)
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
  listHChain3LogsTable: listHChain3LogsTable,
  hchain3logToString: hchain3logToString,
  asJson: asJson,
  submittedBatch: submittedBatch,
}
