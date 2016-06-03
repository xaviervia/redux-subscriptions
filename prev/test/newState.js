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

example('first call, newState in all subscriptions', () => {
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

  assert.equal(firstSubscription.newState, states[1])
  assert.equal(secondSubscription.newState, states[1])
})

example('second call, newState in all subscriptions', () => {
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

  assert.equal(firstSubscription.newState, states[2])
  assert.equal(secondSubscription.newState, states[2])
})
