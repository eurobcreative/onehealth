/**
 * Copyright 2018 Intel Corporation
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

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class Hchain1Payload {
  constructor (name, action, personhash, portoffset ,bloodtype,biosex,birthday) {
    this.name = name
    this.action = action
    this.personhash= personhash
    this.portoffset = portoffset
    this.bloodtype = bloodtype
    this.biosex = biosex
    this.birthday = birthday	  
  }

  static fromBytes (payload) {
    payload = payload.toString().split(',')
    if (payload.length === 6 || payload.length !== 6) {
      let hchain1Payload = new Hchain1Payload(payload[0], payload[1], payload[2], payload[3], payload[4], payload[5], payload[6])


      if (!hchain1Payload.name) {
        throw new InvalidTransaction('Name is required')
      }
      if (hchain1Payload.name.indexOf('|') !== -1) {
        throw new InvalidTransaction('Name cannot contain "|"')
      }

      if (!hchain1Payload.action) {
        throw new InvalidTransaction('Action is required')
      }
    
      return hchain1Payload
    } else {
      throw new InvalidTransaction('Invalid payload serialization')
    }
  }
}

module.exports = Hchain1Payload
