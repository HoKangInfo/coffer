'use strict'

const {promisify} = require('util')
const locks = require('locks')

const coffer = (fn) => {
  const mutex = locks.createMutex()
  const locked = promisify(mutex.lock.bind(mutex))

  return (...args) => locked().then(() => fn(...args)
    .then((x) => ((mutex.unlock(), x)))
    .catch(e => {
      mutex.unlock()
      throw e
    }))
}

const chairs = (num, fn) => {
  const sem = locks.createSemaphore(num)
  const locked = promisify(sem.wait.bind(sem))

  return (...args) => locked().then(() => fn(...args)
    .then((x) => ((sem.signal(), x)))
    .catch(e => {
      sem.signal()
      throw e
    }))
}

module.exports = {
  coffer: coffer,
  chairs: chairs
}
