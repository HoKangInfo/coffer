'use strict'

const {promisify} = require('util')
const locks = require('locks')

module.exports = (fn) => {
  const mutex = locks.createMutex()
  const locked = promisify(mutex.lock.bind(mutex))
  
  return (...args) => locked().then(() => fn(...args)
    .then((x) => ((mutex.unlock(), x)))
    .catch(e => {
      mutex.unlock()
      throw e
    }))
}

