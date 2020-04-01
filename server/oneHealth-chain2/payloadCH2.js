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

class Hchain2Payload {
  constructor (name,action,personblock,calories,bodymassindex,height,weight,stepcount,distancewalkingrunning,sleepdata,heartrate,oxigensaturation,bodytemperature,
bloodpressure,bloodsugar,bloodtype,biosex,birthday) {
      this.name= name
      this.action = action	  
      this.personblock= personblock
      this.calories= calories
      this.bodymassindex= bodymassindex
      this.height= height
      this.weight= weight
      this.stepcount= stepcount
      this.distancewalkingrunning= distancewalkingrunning
      this.sleepdata= sleepdata
      this.heartrate= heartrate
      this.oxigensaturation= oxigensaturation
      this.bodytemperature= bodytemperature
      this.bloodpressure= bloodpressure
      this.bloodsugar= bloodsugar
      this.bloodtype= bloodtype,
      this.biosex= biosex,
      this.birthday= birthday
  }
 
  static fromBytes (payload) {
    payload = payload.toString().split(',')
    if (payload.length === 18 || payload.length !== 18) {
      let hchain2Payload = new Hchain2Payload(payload[0], payload[1], payload[2], payload[3], payload[4], payload[5], payload[6], payload[7], payload[8], payload[9], payload[10], payload[11], payload[12], payload[13],payload[14], payload[15], payload[16],payload[17])
	    



      if (!hchain2Payload.name) {
        throw new InvalidTransaction('Name is required')
      }
      if (hchain2Payload.name.indexOf('|') !== -1) {
        throw new InvalidTransaction('Name cannot contain "|"')
      }

      if (!hchain2Payload.action) {
        throw new InvalidTransaction('Action is required')
      }
  
      return hchain2Payload
    } else {
      throw new InvalidTransaction('Invalid payload serialization')
    }
  }
}

module.exports = Hchain2Payload
