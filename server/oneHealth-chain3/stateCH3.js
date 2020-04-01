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

const crypto = require('crypto')

class Hchain3State {
  constructor (context) {
    this.context = context
    this.addressCache = new Map([])
    this.timeout = 500 // Timeout in milliseconds
  }


  getHChain3Log (name) {
    return this._loadHChain3Logs(name).then((hchain3logs) => {
	    return hchain3logs.get(name)
    })	  
  }

  setHChain3Log (name, hchain3log) {
    let address = _makeHchain3Address(name)

    return this._loadHChain3Logs(name).then((hchain3logs) => {  
      hchain3logs.set(name, hchain3log)
	    
      return hchain3logs
    }).then((hchain3logs) => {
      let data = _serializeHChain3Logs(hchain3logs)
   
      this.addressCache.set(address, data)
      let entries = {
        [address]: data
      }
      return this.context.setState(entries, this.timeout)
    })
  }

  deleteHChain3Log (name) {
    let address = _makeHchain3Address(name)
    return this._loadHChain3Logs(name).then((hchain3logs) => {
      hchain3logs.delete(name)

      if (hchain3logs.size === 0) {
        this.addressCache.set(address, null)
        return this.context.deleteState([address], this.timeout)
      } else {
        let data = _serializeHChain3Logs(hchain3logs)
        this.addressCache.set(address, data)
        let entries = {
          [address]: data
        }
        return this.context.setState(entries, this.timeout)
      }
    })
  }

  _loadHChain3Logs (name) {
  
    let address = _makeHchain3Address(name)
    if (this.addressCache.has(address)) {
      if (this.addressCache.get(address) === null) {
        return Promise.resolve(new Map([]))
      } else {
        return Promise.resolve(_deserializeHChain3Logs(this.addressCache.get(address)))
      }
    } else {
      return this.context.getState([address], this.timeout)
        .then((addressValues) => {
          if (!addressValues[address].toString()) {
            this.addressCache.set(address, null)
            return new Map([])
          } else {
            let data = addressValues[address].toString()
            this.addressCache.set(address, data)
            return _deserializeHChain3Logs(data)
          }
        })
    }
  }
}


const _hash = (x) =>
  crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)

const HCHAIN3_FAMILY = 'hchain3'

const HCHAIN3_NAMESPACE = _hash(HCHAIN3_FAMILY).substring(0, 6)

const _makeHchain3Address = (x) => HCHAIN3_NAMESPACE + _hash(x)

module.exports = {
  HCHAIN3_NAMESPACE,
  HCHAIN3_FAMILY,
  Hchain3State
}



/*Specific Hchain3-HChain3Log  de/serialize */
const _deserializeHChain3Logs = (data) => {
  let hchain3logsIterable = data.split('|').map(x => x.split(','))
    .map(x => [x[0], {name: x[0], hchain3loghash: x[1], personblock: x[2], specialistblock: x[3], timestamp: x[4], commandlog: x[5]}])
  return new Map(hchain3logsIterable)
}

const _serializeHChain3Logs = (hchain3logs) => {
  let hchain3logStrs = []
  for (let nameHChain3Log of hchain3logs) {
    let name = nameHChain3Log[0]
    let hchain3log = nameHChain3Log[1]
    hchain3logStrs.push([name, hchain3log.hchain3loghash, hchain3log.personblock, hchain3log.specialistblock, hchain3log.timestamp, hchain3log.commandlog].join(','))
  }

  hchain3logStrs.sort()

  return Buffer.from(hchain3logStrs.join('|'))
}

