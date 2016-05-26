'use strict'

const example = require('washington')
const assert = require('assert')
const createSubscription = require('./helpers/createSubscription')

const createSetupSubscriptions = require('../src/createSetupSubscriptions')

const states = [
  undefined,
  { the: '1st' },
  { the: '2nd' },
  { the: '3st' },
  { the: '4th' }
]

example('first call, prevState empty in all subscriptions', () => {
  let state
  const firstSubscription = createSubscription()
  const secondSubscription = createSubscription()

  const store = {
    dispatch: () => {},
    getState: () => state
  }

  state = states[0]
  const subscriptions = createSetupSubscriptions()(store)(
    firstSubscription,
    secondSubscription
  )

  state = states[1]
  subscriptions()

  assert.equal(firstSubscription.prevState, undefined)
  assert.equal(secondSubscription.prevState, undefined)
})

example('second call, prevState in all subscriptions', () => {
  let state
  const firstSubscription = createSubscription()
  const secondSubscription = createSubscription()

  const store = {
    dispatch: () => {},
    getState: () => state
  }

  state = states[0]
  const subscriptions = createSetupSubscriptions()(store)(
    firstSubscription,
    secondSubscription
  )

  state = states[1]
  subscriptions()

  state = states[2]
  subscriptions()

  assert.equal(firstSubscription.prevState, states[1])
  assert.equal(secondSubscription.prevState, states[1])
})

example('third call, prevState in all subscriptions', () => {
  let state
  const firstSubscription = createSubscription()
  const secondSubscription = createSubscription()

  const store = {
    dispatch: () => {},
    getState: () => state
  }

  state = states[0]
  const subscriptions = createSetupSubscriptions()(store)(
    firstSubscription,
    secondSubscription
  )

  state = states[1]
  subscriptions()

  state = states[2]
  subscriptions()

  state = states[3]
  subscriptions()

  assert.equal(firstSubscription.prevState, states[2])
  assert.equal(secondSubscription.prevState, states[2])
})
