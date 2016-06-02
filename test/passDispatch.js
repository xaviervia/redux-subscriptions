'use strict'

const example = require('washington')
const assert = require('assert')
const createSubscription = require('./helpers/createSubscription')

const createSetupSubscriptions = require('../src/createSetupSubscriptions')

example('send setTimeouted dispatch to all subscriptions', (done) => {
  const firstSubscriptionStubAction = { the: 'firstSubscriptionStubAction' }
  const firstSubscription = (args) => {
    args.dispatch(firstSubscriptionStubAction)
  }
  const secondSubscriptionStubAction = { the: 'secondSubscriptionStubAction' }
  const secondSubscription = (args) => {
    args.dispatch(secondSubscriptionStubAction)
  }

  const actions = []

  const store = {
    dispatch: (action) => actions.push(action),
    getState: () => {}
  }

  const subscriptions = createSetupSubscriptions()(store)(
    firstSubscription,
    secondSubscription
  )

  subscriptions()

  assert.equal(store.actions.length, 0)

  setTimeout(() => {
    assert.equal(store.actions[0], firstSubscriptionStubAction)
    assert.equal(store.actions[1], secondSubscriptionStubAction)

    done()
  })
})
