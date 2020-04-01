'use strict'

//////////////// copying the createHash function and some other utilities here

// import the base node crypto library for creating hashes for addresses
const crypto = require('crypto')
const SHA256 = require('crypto-js/sha256')

// utility for creating a hash of the given string using the sha512 algorithm
function createHash(st) {
  return crypto.createHash('sha512').update(st).digest('hex').toLowerCase()
}

// utility function to clone an Object to avoid async concurrent rewritting when updating the Object's fields (eg: when modifying "args.urls")
function cloneObject(src) {
  return Object.assign({}, src);
}

//////////////// end of the utilities functions

// import the states libraries
const State = require('./state')        // Chain1
const StateCH2 = require('./stateCH2')  // Chain2 
const StateCH3 = require('./stateCH3')  // Chain3

// import the text formatting library
const Formatters = require('./formatters')          // Chain1
const FormattersCH2 = require('./formattersCH2')    // Chain2
const FormattersCH3 = require('./formattersCH3')    // Chain3

// import the KEY utils library
const keyUtils = require('./key')

// import the Transactions libraries
const Transaction = require('./transaction')         // Chain1
const TransactionCH2 = require('./transactionCH2')   // Chain2
const TransactionCH3 = require('./transactionCH3')   // Chain3

///////////////// end of the importing libraries





///////////////// oneHealth specific utilities functions:

// utility function to obtain the final URL to BlockChain2 or BlockChain3 by appling the proper Port Offset
function applyPortOffsetToURL(url, portoffset=0, targetChain) {
      
    // an URL has this regexp: http://IP:PORT, so the PORT part is 1 position after the second/last colon ':'
    var idx = 1 + url.lastIndexOf(':');
    
    // in case that the PORT part starts with '1' means that we have to apply the offset. 
    // Otherwise the offset has been already applied before and it's set to 0 (so it's not applied twice). 
    var offset=0;
    if (url[idx]=='1')
        offset=portoffset;
       
    // Also, keep in mind that the first digit of the PORT is the target Chain number (1, 2 or 3)
    // so we have to add another position to the index from the last colon ':'
    idx++;
    
    // slice the URL at the lastIndexOf to get the PORT part
    var portstring = url.slice(idx)

    // convert to int and sum the offset 
    var newport = parseInt(portstring) + parseInt(offset)

    //finally, join both parts of the new URL
    return  url.slice(0, idx-1) + targetChain + newport.toString()
}


// It gets the last commited block of CH1 (CH1 -> just person list) in order to create the first block of CH2 (CH2 -> all health data of a given person)
function getLastBlock(args) {

  const state = State(args.url)

  state
    .getLastBlock()
    .then(function(lastBlockId) {

    // add the CH1-Block hash to the args in order to link it with the CH2-new-block-to-be
    args.personblock=lastBlockId;
    
    // Set the Timestamp (if wasn't set)
    if (!args.timestamp)
	    args.timestamp= Date.now();    

    // After collecting the CH1-Block hash, create the first CH2-Block (just right after creating CH1-Block)
    if (args._ && args._[0] && args._[0]=="create"){
        var newArgs= cloneObject(args)
        createPersonDatachain2(newArgs)
    }
    
        })
	
}

// It gets the last commited block of CH2 (CH2 -> person's health data) in order to create the a block of CH3 (CH3 -> BlockChain access logs of a given person)
function getLastBlockCH2(args) {
	
  const stateCH2 = StateCH2(args.url)

  stateCH2
    .getLastBlock()
    .then(function(lastBlockId) {

        // add the CH2-Block hash to the args in order to link it with the CH3-new-block-to-be
        args.specialistblock=lastBlockId;
        
        // Set the Timestamp (if wasn't set)        
        if (!args.timestamp)
            args.timestamp= Date.now();

        //Create a CH3-block (an access log)
        createHchain3log(args)
    })
	

}

// It creates the first block of a CH2 (eg: the first health data of a given person)
function createPersonDatachain2(args) {

    try{	

      //We have to calculate the actual CH2 URL PORT
      var url=args.url=applyPortOffsetToURL(args.url,args.portoffset,2)



      const stateCH2 = StateCH2(url)


      // load the keys from disk based on the keyDir and keyName
      const keys = keyUtils.getKeys(args.keyDir, args.keyName)

      // create a signer using our private key
      const signer = TransactionCH2.createSigner(keys.private)

      var spaceString= String(args.space)
         
      var hashedSpace = createHash(spaceString);


      //Set the Chain flag (CH2 -> CH3)
      args.sentChain="CH2"
        
      // Set the Timestamp (if wasn't set) 
      if (!args.timestamp)
            args.timestamp= Date.now();
            

      // create the payload
      const payloadC2 = [args.name, 'create',args.personblock,,,,,,,,,,,,, args.bloodtype,args.biosex,args.birthday].join(',')

      // Set the command log to be equal to the payload
      args.commandlog=payloadC2;
      
	
      // create the signed transaction ready to send
      // this will return the raw binary we will send to the rest api
      const batchListBytes = TransactionCH2.singleTransactionBytes({
        signer: signer,
        personName: args.name,
        payload: payloadC2,
      })

      // send the batch list bytes to the CH2 rest api, then there'd be a chained batch to be sent to CH3 (the log)

      var newArgs= cloneObject(args)	
      stateCH2
        .sendBatch(batchListBytes)
        .then(_submitBatchListHandlerChained(stateCH2, newArgs.format, true, newArgs))        
        .catch(_errorHandler)


    }catch (e) {
      console.log(e);

    }
}


// It creates and appends a new block of a CH2 (eg: new health data of a given person)
function updatePersonDatachain2(args) {

    try{	

      //We have to calculate the actual CH2 URL PORT
      var url=args.url=applyPortOffsetToURL(args.url,args.portoffset,2)



      const stateCH2 = StateCH2(url)


      // load the keys from disk based on the keyDir and keyName
      const keys = keyUtils.getKeys(args.keyDir, args.keyName)

      // create a signer using our private key
      const signer = TransactionCH2.createSigner(keys.private)

      var spaceString= String(args.space)
      
      var hashedSpace = createHash(spaceString);

      //Set the Chain flag (CH2 -> CH3)
      args.sentChain="CH2"

      // Set the Timestamp (if wasn't set)
      if (!args.timestamp)
        args.timestamp= Date.now();

      // As this isn't the first block of a CH2, there'd be another block with the same name, 
      // so we have to append the timestamp in oreder to avoid duplicates
      var nameTimestamp=args.name+"/"+args.timestamp

      // create the payload
      const payloadC2 = [nameTimestamp, 'create', args.personblock, args.calories ,args.bodymassindex ,args.height, args.weight, args.stepcount, args.distancewalkingrunning,args.sleepdata,args.heartrate, args.oxigensaturation,args.bodytemperature,args.bloodpressure,args.bloodsugar,args.bloodtype,args.biosex,args.birthday ].join(',')
      
      
      // Set the command log to be equal to the payload
      args.commandlog=payloadC2.toString().replace("create", "save");
         

      // create the signed transaction ready to send
      // this will return the raw binary we will send to the rest api
      const batchListBytes = TransactionCH2.singleTransactionBytes({
        signer: signer,
        personName: nameTimestamp,
        payload: payloadC2,
      })

      // send the batch list bytes to the CH2 rest api, then there'd be a chained batch to be sent to CH3 (the log)	
      var newArgs= cloneObject(args)	
      stateCH2
        .sendBatch(batchListBytes)
        .then(_submitBatchListHandlerChained(stateCH2, newArgs.format, true, newArgs))        
        .catch(_errorHandler)


    }catch (e) {
      console.log(e);
    }
}



// It creates and appends a new block of a CH3 (eg: new access log of a given person)
function createHchain3log(args) {

    try{	

      //We have to calculate the actual CH3 URL PORT    
      var url=args.url=applyPortOffsetToURL(args.url,args.portoffset,3)
          
      // Set the Timestamp (if wasn't set)
      if(!args.timestamp)
            args.timestamp= Date.now();

      const stateCH3 = StateCH3(url)


      // load the keys from disk based on the keyDir and keyName
      const keys = keyUtils.getKeys(args.keyDir, args.keyName)

      // create a signer using our private key
      const signer = TransactionCH3.createSigner(keys.private)

      var spaceString= String(args.space)
        
      var hashedSpace = createHash(spaceString);


      // As this may be not the first block of a CH3, there could be another block with the same name, 
      // so we have to append the timestamp in oreder to avoid duplicates
      var nameTimestamp=args.name+"/"+args.timestamp
      
      // create a payload representing a "CH3-save" new hchain3log action
      const payloadC3 = [nameTimestamp, 'create', keys.public, args.personblock, args.specialistblock ,args.timestamp ,"\""+args.commandlog.replace(/,/g, ';')+"\""].join(',')  



      // create the signed transaction ready to send
      // this will return the raw binary we will send to the rest api
      const batchListBytes = TransactionCH3.singleTransactionBytes({
        signer: signer,
        hchain3logName: nameTimestamp,
        payload: payloadC3,
      })

      // send the batch list bytes to the CH3 rest api
	
      stateCH3
        .sendBatch(batchListBytes)
        .then(_submitBatchListHandler(stateCH3, args.format, args.wait))
        .catch(_errorHandler)


    }catch (e) {
      console.log(e);
    }
}

///////////////// END OF oneHealth specific utilities functions:

///////////////// oneHealth handlers functions:

/*

  the list persons command handler

   * call the loadPersons method of the state library
   * format the output

  args:

   * url - the url of the restAPi server
   * format - the format for the output
  
*/
function listPersons(args) {
  const state = State(args.url)

  state
    .loadPersons()
    .then(function(personList) {

      if(args.format == 'json') {
        console.log(Formatters.asJson(personList))
      }
      else {
        console.log(Formatters.listPersonsTable(personList))
      }

      personList.map(function(person){
          var newArgs= cloneObject(args)
          newArgs.name=person.name;
          newArgs.portoffset=person.portoffset;
          newArgs.commandlog="list"
          createHchain3log(newArgs)	      
      })

    })
}

/*

  the list blocks command handler

   * call the loadBlocks method of the state library
   * format the output

  args:

   * url - the url of the restAPi server
   * format - the format for the output
  
*/
function listBlocks(args) {
  const state = State(args.url)

  state
    .loadBlocks()
    .then(function(personList) {


    return;
      if(args.format == 'json') {
        console.log(Formatters.asJson(personList))
      }
      else {
        console.log(Formatters.listPersonsTable(personList))
      }

    })
}


/*

  show the details of an existing person

   * call the loadPerson method of the stateCH2 library (Access the Health Data)
   * format the output

  args:

   * url - the url of the restAPi server
   * name - the name of the existing person
   * format - the format for the output
  
*/
function showPerson(args) {
  const state = State(args.url)

  state
    .loadPerson(args.name)
    .then(function(personData) {

      // if the person is not found then error
      if(!personData) {
        console.error(`There was no person found with the name: ${args.name}`)
        process.exit(1)
      }


      var newArgs= cloneObject(args)
      newArgs.name=personData.name;
      newArgs.commandlog="show "+ personData.name;
      newArgs.portoffset=personData.portoffset;
      
      //We have to calculate the actual CH2 URL PORT
      newArgs.url=applyPortOffsetToURL(newArgs.url,newArgs.portoffset,2)

      
      const stateCH2 = StateCH2(newArgs.url)

      // Make the list query to Chain2
      stateCH2
        .loadPersons()
        .then(function(personList) {

          if(args.format == 'json') {
            console.log(FormattersCH2.asJson(personList))
          }
          else {
            console.log(FormattersCH2.listPersonsTable(personList))
          }


        })



      // Log the command to Chain 3
      var newArgs2= cloneObject(args)
      newArgs2.name=personData.name;
      newArgs2.commandlog="show "+ personData.name;
      newArgs2.portoffset=personData.portoffset;
      createHchain3log(newArgs)	      


      if(args.format == 'json') {
        console.log(Formatters.asJson(personData))
      }
      else {
        console.log(Formatters.personToString(personData))
      }
    })
}


/*

  show the access logs of an existing person

   * call the loadPerson method of the stateCH3 library (Access the Data Logs)
   * format the output

  args:

   * url - the url of the restAPi server
   * name - the name of the existing person
   * format - the format for the output
  
*/
function showLogs(args) {
  const state = State(args.url)

      
  state
    .loadPerson(args.name)
    .then(function(personData) {

      // if the person is not found then error
      if(!personData) {
        console.error(`There was no person found with the name: ${args.name}`)
        process.exit(1)
      }


      var newArgs= cloneObject(args)
      newArgs.name=personData.name;
      newArgs.commandlog="showlogs "+ personData.name;
      newArgs.portoffset=personData.portoffset;
      
      //We have to calculate the actual CH3 URL PORT
      newArgs.url=applyPortOffsetToURL(newArgs.url,newArgs.portoffset,3)
      
      
      const stateCH3 = StateCH3(newArgs.url)

      // Make the list query to Chain3
      stateCH3
        .loadHChain3Logs()
        .then(function(logList) {

          if(args.format == 'json') {
            console.log(FormattersCH3.asJson(logList))
          }
          else {
            console.log(FormattersCH3.listHChain3LogsTable(logList))
          }


        })



      // Log the command to Chain 3
      var newArgs2= cloneObject(args)
      newArgs2.name=personData.name;
      newArgs2.commandlog="showlogs "+ personData.name;
      newArgs2.portoffset=personData.portoffset;
      createHchain3log(newArgs)	      


      if(args.format == 'json') {
        console.log(Formatters.asJson(personData))
      }
      else {
        console.log(Formatters.personToString(personData))
      }
    })
}







/*

  the create Person command handler

   * check the keys exist
   * create a new transaction
   * call the createPerson method of the state library
   * format the output

  args:

   * name - the name of the new person
   * url - the url of the restAPi server
   * keyDir - the directory the keys live in
   * keyName - the name of the key to use when submitting the transaction
   * wait - whether to wait for the transaction status to complete or error
   * format - the format for the output
  
*/
function createPerson(args) {
  
  const state = State(args.url)

  state
    .loadBlocks()
    .then(function(blockList) {
    
            
          // load the keys from disk based on the keyDir and keyName
          const keys = keyUtils.getKeys(args.keyDir, args.keyName)

          // create a signer using our private key
          const signer = Transaction.createSigner(keys.private)



          // Check what is the last block number before creating the new one
          var lastBlockNum=blockList.data[0].header.block_num
          var newBlockNum= parseInt(lastBlockNum) 
          
          
          if (newBlockNum>=3)
          {
            console.log("oneHealth demo just admits 3 persons, so it will not create more")
            return;
          }
          args.portoffset=newBlockNum;
          
          // create a payload representing a create new person action          
          const payload = [args.name, 'create',keys.public,newBlockNum].join(',')  

          args.sentChain="CH1";
          args.commandlog=[args.name, 'create',keys.public,newBlockNum, args.bloodtype,args.biosex,args.birthday].join(',');

          // create the signed transaction ready to send
          // this will return the raw binary we will send to the rest api
          const batchListBytes = Transaction.singleTransactionBytes({
            signer: signer,
            personName: args.name,
            payload: payload,
          })

          var newArgs= cloneObject(args)	

          // send the batch list bytes to the CH1 rest api
          state
            .sendBatch(batchListBytes)
            .then(_submitBatchListHandlerChained(state, newArgs.format, true, newArgs))
            .catch(_errorHandler)
    })            
}



/*

  save data of an existing person (at BC2)

   * check the keys exist
   * create a new transaction
   * call the savePerson method of the state library
   * format the output

  args:

   * name - the name of the new person
   * space - the space to take in the person
   * url - the url of the restAPi server
   * keyDir - the directory the keys live in
   * keyName - the name of the key to use when submitting the transaction
   * wait - whether to wait for the transaction status to complete or error
   * format - the format for the output
  
*/



function savePerson(args) {
  const state = State(args.url)

  state
    .loadPerson(args.name)
    .then(function(personData) {

      // if the person is not found then error
      if(!personData) {
        console.error(`There was no person found with the name: ${args.name}`)
        process.exit(1)
      }
      
      // The
      args.portoffset=personData.portoffset;
      updatePersonDatachain2(args)

    })
}







// Currently the delete option is not available at this oneHealth demo
/*

  delete an existing person
  

   * check the keys exist
   * create a new transaction
   * call the deletePerson method of the state library
   * format the output

  args:

   * name - the name of the new person
   * url - the url of the restAPi server
   * keyDir - the directory the keys live in
   * keyName - the name of the key to use when submitting the transaction
   * wait - whether to wait for the transaction status to complete or error
   * format - the format for the output
  
*/
function deletePerson(args) {
    console.log("Currently the delete option is not available at this oneHealth demo")
    return
}
/*
function deletePerson(args) {
  const state = State(args.url)

  // load the keys from disk based on the keyDir and keyName
  const keys = keyUtils.getKeys(args.keyDir, args.keyName)

  // create a signer using our private key
  const signer = Transaction.createSigner(keys.private)

  // create a payload representing a create new person action
  const payload = [args.name, 'delete', ''].join(',')




  // create the signed transaction ready to send
  // this will return the raw binary we will send to the rest api
  const batchListBytes = Transaction.singleTransactionBytes({
    signer: signer,
    personName: args.name,
    payload: payload,
  })

  // send the batch list bytes to the CH1 rest api
  state
    .sendBatch(batchListBytes)
    .then(_submitBatchListHandler(state, args.format, args.wait))
    .catch(_errorHandler)
}
*/


// generic handler for submitted transactions
// if the wait flag is set - we wait for the 
// submitted transaction status to be COMMITTED or INVALID
// and print the status
// otherwise we print the batch id
function _submitBatchListHandler(state, format, wait) {
  return function(batchId) {
    // wait for the 
    if(wait) {

      state.waitBatch(batchId, function(err, batchStatus){
        if(err) {
          console.error(err)
          process.exit(1)
        }
        if(format == 'json') {
          console.log(Formatters.asJson(batchStatus))
        }
        else {
          console.log(Formatters.submittedBatch(batchStatus))
        }
      })
    }
    else {
      if(format == 'json') {
        console.log(Formatters.asJson({
          batchId: batchId, 
        }))
      }
      else {
        console.log(`batch id: ${batchId}`)
      }
    }
  }
}

// generic handler for submitted CHAINED transactions
// we always wait for the 
// submitted transaction status to be COMMITTED or INVALID
// and print the status
// otherwise we print the batch id
function _submitBatchListHandlerChained(state, format, wait, args) {
  return function(batchId) {
    wait=true;
    // Chained handlers ALWAYS need to wait to the response in order to call the other Chains
    if(wait) {

      state.waitBatch(batchId, function(err, batchStatus){
        if(err) {
          console.error(err)
          process.exit(1)
        }
        if(batchStatus.status!="COMMITTED") {
          console.error(batchStatus.invalid_transactions[0].message)
          process.exit(1)
        }        
        if(format == 'json') {
          console.log(Formatters.asJson(batchStatus))
        }
        else {
          console.log(Formatters.submittedBatch(batchStatus))
        }
   
        
        try{


                //we have to check if the next chained batch has to be sent to CH2 or CH3
                // Eg: (CH1 -> CH2) or (CH2 -> CH3)
                if(args.sentChain=="CH1"){
                    var newArgs= cloneObject(args)
                    var lastBlockId= getLastBlock(newArgs)
                }else if(args.sentChain=="CH2"){
                    var newArgs= cloneObject(args)
                    var lastBlockId= getLastBlockCH2(newArgs)
                }



        }

        catch (e) {
          console.log(e);
        }


      })
    }
    else {




      if(format == 'json') {
        console.log(Formatters.asJson({
          batchId: batchId,
        }))
      }
      else {
        console.log(`batch id : ${batchId}`)
      }
    }
  }
}



// generic error handler for rest api responses
// prints error messages from the validator if they are present
function _errorHandler(err) {
  if(err.response && err.response.data && err.response.data.error) {
    const error = err.response.data.error
    console.error(`error code ${error.code} - ${error.title}`)
    console.error(`${error.message}`)
  }
  else if(err.response && err.response.data) {
    console.error(err.response.data)
  }
  else {
    console.error(`error ${err}`)
  }
}

module.exports = {
  listPersons: listPersons,
  createPerson: createPerson,
  showPerson: showPerson,
  showLogs: showLogs,
  deletePerson: deletePerson,
  savePerson:savePerson,
  listBlocks:listBlocks,	
}
