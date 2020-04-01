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

class Hchain3Payload {
  constructor (name, action, hchain3loghash, personblock ,specialistblock,timestamp,commandlog) {
    this.name = name
    this.action = action
    this.hchain3loghash= hchain3loghash
    this.personblock = personblock
    this.specialistblock = specialistblock
    this.timestamp = timestamp
    this.commandlog = commandlog	  
  }

  static fromBytes (payload) {
    payload = payload.toString().split(',')
    if (payload.length === 6 || payload.length !== 6) {
      let hchain3Payload = new Hchain3Payload(payload[0], payload[1], payload[2], payload[3], payload[4], payload[5], payload[6])



      if (!hchain3Payload.name) {
        throw new InvalidTransaction('Name is required')
      }
      if (hchain3Payload.name.indexOf('|') !== -1) {
        throw new InvalidTransaction('Name cannot contain "|"')
      }

      if (!hchain3Payload.action) {
        throw new InvalidTransaction('Action is required')
      }
    
      return hchain3Payload
    } else {
      throw new InvalidTransaction('Invalid payload serialization')
    }
  }
}

module.exports = Hchain3Payload
