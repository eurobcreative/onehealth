const { TransactionProcessor } = require('sawtooth-sdk/processor')
const HCHAIN3Handler = require('./handlerCH3')

// In docker, the address would be the validator's container name
// with port 34004

var args = process.argv.slice(2);

// address value is passed through the first argument, default value is 'tcp://127.0.0.1:34004' 
const address = (args[0]?args[0]:'tcp://127.0.0.1:34004')
const transactionProcessor = new TransactionProcessor(address)

console.log("listener address = "+address)
transactionProcessor.addHandler(new HCHAIN3Handler())

transactionProcessor.start()
