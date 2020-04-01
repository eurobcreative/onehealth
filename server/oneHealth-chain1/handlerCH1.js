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

const Hchain1Payload = require('./payloadCH1')

const { HCHAIN1_NAMESPACE, HCHAIN1_FAMILY, Hchain1State } = require('./stateCH1')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

const _personToStr = (personhash, portoffset, bloodtype, biosex, name, birthday) => {

  let out = ''
  out += `Name: ${name}\n`
  out += `Hash: ${personhash}\n`
  out += `Steps: ${portoffset}\n`
  out += `Blood Type: ${bloodtype}\n`
  out += `Biological Sex: ${biosex}\n`
  out += `Birth Day: ${birthday}\n`	

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



class HCHAIN1Handler extends TransactionHandler {
  constructor () {
    super(HCHAIN1_FAMILY, ['1.0'], [HCHAIN1_NAMESPACE])
  }

  apply (transactionProcessRequest, context) {
    let payload = Hchain1Payload.fromBytes(transactionProcessRequest.payload)
    let hchain1State = new Hchain1State(context)
    let header = transactionProcessRequest.header
    let player = header.signerPublicKey



    if (payload.action === 'create') {
      return hchain1State.getPerson(payload.name)
        .then((person) => {
          if (person !== undefined) {
            throw new InvalidTransaction('Invalid Action: a Person with that name already exists.')
          }

          let createdPerson = {
            name: payload.name,
            personhash: payload.personhash,
            portoffset: payload.portoffset,  
          }

          _display(`userKey ${player.toString().substring(0, 6)} created person named ${payload.name}`)
          return hchain1State.setPerson(payload.name, createdPerson)
        })

    } else if (payload.action === 'save') {
      return hchain1State.getPerson(payload.name)
        .then((person) => {



          if (person === undefined) {
            throw new InvalidTransaction(
              'Invalid Action: Save requires an existing Person.'
            )
          }

          if (person.personhash !== payload.personhash) {
            throw new InvalidTransaction(
              `The person's hash doesn't match: ${person.personhash} Vs ${payload.personhash}`
           )
          }	
		
            person.portoffset=payload.portoffset
	        person.bloodtype=payload.bloodtype
	        person.biosex=payload.biosex
	        person.birthday=payload.birthday

          let playerString = player.toString().substring(0, 6)

          _display(
            `Person ${playerString} saves new data: \n\n` +
              _personToStr(
                person.personhash,
                person.portoffset,
                person.bloodtype,
                person.biosex,
                payload.name,
                person.birthday		      
              )
          )	
          return hchain1State.setPerson(payload.name, person)
        })


    } else if (payload.action === 'delete') {
      return hchain1State.getPerson(payload.name)
        .then((person) => {
          if (person === undefined) {
            throw new InvalidTransaction(
              `No person exists with name ${payload.name}: unable to delete`)
          }
          _display(`userKey ${player.toString().substring(0, 6)} deleted person named ${payload.name}`)
		
          return hchain1State.deletePerson(payload.name)
        })
    } else {
      throw new InvalidTransaction(
        `Action must be create, delete, or save not ${payload.action}`
      )
    }
  }
}

module.exports = HCHAIN1Handler
