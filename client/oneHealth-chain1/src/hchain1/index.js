#!/usr/bin/env node
'use strict'

/*

  the main entry point of the client

  we process the command line arguments and call the relevent command

  the rest-api URL is checked 
  
*/

const yargs = require('yargs')

// import the handlers that will execute each command
const handlers = require('./handlers')




yargs
  .command({
    command: 'list',
    desc: 'List the current HCHAIN1 persons',
    handler: handlers.listPersons,
  })
  .command({
    command: 'create <name> <bloodtype> <biosex> <birthday>',
    desc: 'Create a new HCHAIN1 person',
    handler: handlers.createPerson,
  })
  .command({
    command: 'show <name>',
    desc: 'Display the current status of an HCHAIN1 person',
    handler: handlers.showPerson,
  })
  .command({
    command: 'showlogs <name>',
    desc: 'Display the current HCHAIN3 Logs of an HCHAIN1 person',
    handler: handlers.showLogs,
  })  
  .command({
    command: 'delete <name>',
    desc: 'Delete an existing HCHAIN1 person',
    handler: handlers.deletePerson,
  })
  .command({
    command: 'blocks',
    desc: 'List ALL the blocks',
    handler: handlers.listBlocks,
  })
  .command({
    command: 'save <name> <calories> <bodymassindex> <height> <weight> <stepcount> <distancewalkingrunning> <sleepdata> <heartrate> <oxigensaturation> <bodytemperature> <bloodpressure> <bloodsugar>',
    desc: 'Save the latest datat of a given User',
    handler: handlers.savePerson,
  })
  .option('url', {
    describe: 'the url to connect to the rest api',
    default: 'http://localhost:18008',	  
  })
  .option('format', {
    describe: 'the format of the output (text, json)',
    default: 'text',
  })
  .option('key-dir', {
    describe: 'the directory to read the keys from',
    default: '/home/ledger/oneHealth/blockchains/config/keys/',
  })
  .option('key-name', {
    describe: 'the name of the keys to use for submitting new transactions',
    default: 'jill',	  
  })
  .demandCommand()
  .demandOption(['url'], 'Please provide a --url option (or URL env variable) to connect to the rest api')
  .help()
  .argv
