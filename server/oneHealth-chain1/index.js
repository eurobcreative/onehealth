const { TransactionProcessor } = require('sawtooth-sdk/processor')
const HCHAIN1Handler = require('./handlerCH1')

// In docker, the address would be the validator's container name
// with port 14004

var args = process.argv.slice(2);

// address value is passed through the first argument, default value is 'tcp://127.0.0.1:14004' 
const address = (args[0]?args[0]:'tcp://127.0.0.1:14004')
const transactionProcessor = new TransactionProcessor(address)

console.log("listener address = "+address)
transactionProcessor.addHandler(new HCHAIN1Handler())

transactionProcessor.start()
