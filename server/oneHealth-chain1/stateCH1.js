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

class Hchain1State {
  constructor (context) {
    this.context = context
    this.addressCache = new Map([])
    this.timeout = 500 // Timeout in milliseconds
  }


  getPerson (name) {
    return this._loadPersons(name).then((persons) => {
	    return persons.get(name)
    })	  
  }

  setPerson (name, person) {
    let address = _makeHchain1Address(name)

    return this._loadPersons(name).then((persons) => {   
      persons.set(name, person)
	    
      return persons
    }).then((persons) => {
      let data = _serializePersons(persons)	    
      this.addressCache.set(address, data)
      let entries = {
        [address]: data
      }
      return this.context.setState(entries, this.timeout)
    })
  }

  deletePerson (name) {
    let address = _makeHchain1Address(name)
    return this._loadPersons(name).then((persons) => {
      persons.delete(name)

      if (persons.size === 0) {
        this.addressCache.set(address, null)
        return this.context.deleteState([address], this.timeout)
      } else {
        let data = _serializePersons(persons)
        this.addressCache.set(address, data)
        let entries = {
          [address]: data
        }
        return this.context.setState(entries, this.timeout)
      }
    })
  }

  _loadPersons (name) {
    let address = _makeHchain1Address(name)
    if (this.addressCache.has(address)) {
      if (this.addressCache.get(address) === null) {
        return Promise.resolve(new Map([]))
      } else {
        return Promise.resolve(_deserializePersons(this.addressCache.get(address)))
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
            return _deserializePersons(data)
          }
        })
    }
  }
}

const _hash = (x) =>
  crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)

const HCHAIN1_FAMILY = 'hchain1'

const HCHAIN1_NAMESPACE = _hash(HCHAIN1_FAMILY).substring(0, 6)

const _makeHchain1Address = (x) => HCHAIN1_NAMESPACE + _hash(x)

module.exports = {
  HCHAIN1_NAMESPACE,
  HCHAIN1_FAMILY,
  Hchain1State
}


/*Specific Hchain1-Person  de/serialize */
const _deserializePersons = (data) => {
  let personsIterable = data.split('|').map(x => x.split(','))
    .map(x => [x[0], {name: x[0], personhash: x[1], portoffset: x[2]}])
  return new Map(personsIterable)
}

const _serializePersons = (persons) => {
  let personStrs = []
  for (let namePerson of persons) {
    let name = namePerson[0]
    let person = namePerson[1]
    personStrs.push([name, person.personhash, person.portoffset].join(','))
  }

  personStrs.sort()

  return Buffer.from(personStrs.join('|'))
}
