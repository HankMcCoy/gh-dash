const delay = timeInMs => value =>
  new Promise(resolve => setTimeout(() => resolve(value), timeInMs))

module.exports = delay
