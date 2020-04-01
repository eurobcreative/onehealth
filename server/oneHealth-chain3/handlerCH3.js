/**
 * Copyright 2017-2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

'use strict'

const Hchain3Payload = require('./payloadCH3')

const { HCHAIN3_NAMESPACE, HCHAIN3_FAMILY, Hchain3State } = require('./stateCH3')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

const _hchain3logToStr = (hchain3loghash, personblock, specialistblock, timestamp, name, commandlog) => {

  let out = ''
  out += `Name: ${name}\n`
  out += `Hash: ${hchain3loghash}\n`
  out += `Steps: ${personblock}\n`
  out += `Light Sleep: ${specialistblock}\n`
  out += `Deep Sleep: ${timestamp}\n`
  out += `Weight: ${commandlog}\n`	

  return out
}

const _display = msg => {
  let n = msg.search('\n')
  let length = 0

  if (n !== -1) {
    msg = msg.split('\n')
    for (let i = 0; i < msg.length; i++) {
      if (msg[i].length > length) {
        length = msg[i].length
      }
    }
  } else {
    length = msg.length
    msg = [msg]
  }

  console.log('+' + '-'.repeat(length + 2) + '+')
  for (let i = 0; i < msg.length; i++) {
    let len = length - msg[i].length

    if (len % 2 === 1) {
      console.log(
        '+ ' +
          ' '.repeat(Math.floor(len / 2)) +
          msg[i] +
          ' '.repeat(Math.floor(len / 2 + 1)) +
          ' +'
      )
    } else {
      console.log(
        '+ ' +
          ' '.repeat(Math.floor(len / 2)) +
          msg[i] +
          ' '.repeat(Math.floor(len / 2)) +
          ' +'
      )
    }
  }
  console.log('+' + '-'.repeat(length + 2) + '+')
}


class HCHAIN3Handler extends TransactionHandler {
  constructor () {
    super(HCHAIN3_FAMILY, ['1.0'], [HCHAIN3_NAMESPACE])
  }

  apply (transactionProcessRequest, context) {
    let payload = Hchain3Payload.fromBytes(transactionProcessRequest.payload)
    let hchain3State = new Hchain3State(context)
    let header = transactionProcessRequest.header
    let player = header.signerPublicKey



    if (payload.action === 'create') {
    
      return hchain3State.getHChain3Log(payload.name)
        .then((hchain3log) => {
          if (hchain3log !== undefined) {        
            throw new InvalidTransaction('Invalid Action: a HChain3Log with that name already exists.')

          }

          let createdHChain3Log = {
            name: payload.name,
            hchain3loghash: payload.hchain3loghash,
            
            personblock: payload.personblock,
            specialistblock: payload.specialistblock,
            timestamp: payload.timestamp,
            commandlog: payload.commandlog                          
            
          }

          _display(`userKey ${player.toString().substring(0, 6)} created hchain3log named ${payload.name}`)

          return hchain3State.setHChain3Log(payload.name, createdHChain3Log)
        })


    } else if (payload.action === 'save') {
      return hchain3State.getHChain3Log(payload.name)
        .then((hchain3log) => {


          if (hchain3log === undefined) {
            throw new InvalidTransaction(
              'Invalid Action: Save requires an existing HChain3Log.'
            )
          }
/*      //Now the users hashes doesn't need to match as a third user may list/read some other's data
          if (hchain3log.hchain3loghash !== payload.hchain3loghash) {
            throw new InvalidTransaction(
              `The hchain3log's hash doesn't match: ${hchain3log.hchain3loghash} Vs ${payload.hchain3loghash}`
           )
          }	
*/		
        hchain3log.personblock=payload.personblock
		hchain3log.specialistblock=payload.specialistblock
		hchain3log.timestamp=payload.timestamp
		hchain3log.commandlog=payload.commandlog

          let playerString = player.toString().substring(0, 6)

          _display(
            `HChain3Log ${playerString} saves new data: \n\n` +
              _hchain3logToStr(
                hchain3log.hchain3loghash,
                hchain3log.personblock,
                hchain3log.specialistblock,
                hchain3log.timestamp,
                payload.name,
                hchain3log.commandlog		      
              )
          )
	
          return hchain3State.setHChain3Log(payload.name, hchain3log)
        })


    } else if (payload.action === 'delete') {
      return hchain3State.getHChain3Log(payload.name)
        .then((hchain3log) => {
          if (hchain3log === undefined) {
            throw new InvalidTransaction(
              `No hchain3log exists with name ${payload.name}: unable to delete`)
          }
          _display(`userKey ${player.toString().substring(0, 6)} deleted hchain3log named ${payload.name}`)
		
          return hchain3State.deleteHChain3Log(payload.name)
        })
    } else {
      throw new InvalidTransaction(
        `Action must be create, delete, or take not ${payload.action}`
      )
    }
  }
}

module.exports = HCHAIN3Handler
