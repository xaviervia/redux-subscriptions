'use strict'

const example = require('washington')
const assert = require('assert')
const createSubscription = require('./helpers/createSubscription')

const createSetupSubscriptions = require('../src/createSetupSubscriptions')

example('send dispatch to all subscriptions', () => {
  const firstSubscription = createSubscription()
  const secondSubscription = createSubscription()

  const store = {
    dispatch: () => {},
    getState: () => {}
  }

  const subscriptions = createSetupSubscriptions()(store)(
    firstSubscription,
    secondSubscription
  )

  subscriptions()

  assert.equal(firstSubscription.dispatch, store.dispatch)
  assert.equal(secondSubscription.dispatch, store.dispatch)
})
