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

const Hchain2Payload = require('./payloadCH2')

const { HCHAIN2_NAMESPACE, HCHAIN2_FAMILY, Hchain2State } = require('./stateCH2')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

const _personToStr = (name, personblock,calories,bodymassindex,height,weight,stepcount,distancewalkingrunning,sleepdata,heartrate,oxigensaturation,bodytemperature,
bloodpressure,bloodsugar,bloodtype,biosex,birthday) => {

  let out = ''
  out += `Name: ${name}\n`
  out += `Hash: ${personblock}\n`

  out += `Blood Type: ${bloodtype}\n`
  out += `Biological Sex: ${biosex}\n`
  out += `Birth Day: ${birthday}\n`	

  out += `Calories: ${calories}\n`
  out += `Body Mass Index: ${bodymassindex}\n`
  out += `Height: ${height}\n`
  out += `Weight: ${weight}\n`
  out += `Step Count: ${stepcount}\n`
  out += `Distance Walking/Running: ${distancewalkingrunning}\n`
  out += `Sleep Data: ${sleepdata}\n`
  out += `Heart Rate: ${heartrate}\n`
  out += `Oxigen Saturation: ${oxigensaturation}\n`
  out += `Body Temperature: ${bodytemperature}\n`
  out += `Blood Pressure: ${bloodpressure}\n`
  out += `Blood Sugar: ${bloodsugar}\n`	

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


class HCHAIN2Handler extends TransactionHandler {
  constructor () {
    super(HCHAIN2_FAMILY, ['1.0'], [HCHAIN2_NAMESPACE])
  }

  apply (transactionProcessRequest, context) {
    let payload = Hchain2Payload.fromBytes(transactionProcessRequest.payload)
    let hchain2State = new Hchain2State(context)
    let header = transactionProcessRequest.header
    let player = header.signerPublicKey



    if (payload.action === 'create') {
      return hchain2State.getPerson(payload.name)
        .then((person) => {
          if (person !== undefined) {
            throw new InvalidTransaction('Invalid Action: a Person with that name already exists.')
          }

          let createdPerson = {
            name: payload.name,
            personblock: payload.personblock,

      calories: payload.calories,
      bodymassindex: payload.bodymassindex,
      height: payload.height,
      weight: payload.weight,
      stepcount: payload.stepcount,
      distancewalkingrunning: payload.distancewalkingrunning,
      sleepdata: payload.sleepdata,
      heartrate: payload.heartrate,
      oxigensaturation: payload.oxigensaturation,
      bodytemperature: payload.bodytemperature,
      bloodpressure: payload.bloodpressure,
      bloodsugar: payload.bloodsugar,

      bloodtype: payload.bloodtype,
      biosex: payload.biosex,
      birthday: payload.birthday, 		  
    
          }

          _display(`userKey ${player.toString().substring(0, 6)} created person named ${payload.name}`)

          return hchain2State.setPerson(payload.name, createdPerson)
        })

    } else if (payload.action === 'save') {
      return hchain2State.getPerson(payload.name)
        .then((person) => {


          if (person === undefined) {
            throw new InvalidTransaction(
              'Invalid Action: Save requires an existing Person.'
            )
          }

          if (person.personblock !== payload.personblock) {
            throw new InvalidTransaction(
              `The person's hash doesn't match: ${person.personblock} Vs ${payload.personblock}`
           )
}	
	

      person.name= payload.name
      person.personblock= payload.personblock
      person.calories= payload.calories
      person.bodymassindex= payload.bodymassindex
      person.height= payload.height
      person.weight= payload.weight
      person.stepcount= payload.stepcount
      person.distancewalkingrunning= payload.distancewalkingrunning
      person.sleepdata= payload.sleepdata
      person.heartrate= payload.heartrate
      person.oxigensaturation= payload.oxigensaturation
      person.bodytemperature= payload.bodytemperature
      person.bloodpressure= payload.bloodpressure
      person.bloodsugar= payload.bloodsugar

      let playerString = player.toString().substring(0, 6)

          _display(
            `Person ${playerString} saves new data: \n\n` +
              _personToStr(
                  person.name,
                  person.personblock,
                  person.calories,
                  person.bodymassindex,
                  person.height,
                  person.weight,
                  person.stepcount,
                  person.distancewalkingrunning,
                  person.sleepdata,
                  person.heartrate,
                  person.oxigensaturation,
                  person.bodytemperature,
                  person.bloodpressure,
                  person.bloodsugar,

                  person.bloodtype,
                  person.biosex,
                  person.birthday, 		      

              )

          )
		
          return hchain2State.setPerson(payload.name, person)
        })


    } else if (payload.action === 'delete') {
      return hchain2State.getPerson(payload.name)
        .then((person) => {
          if (person === undefined) {
            throw new InvalidTransaction(
              `No person exists with name ${payload.name}: unable to delete`)
          }
          _display(`userKey ${player.toString().substring(0, 6)} deleted person named ${payload.name}`)
		
          return hchain2State.deletePerson(payload.name)
        })
    } else {
      throw new InvalidTransaction(
        `Action must be create, delete, or take not ${payload.action}`
      )
    }
  }
}

module.exports = HCHAIN2Handler
