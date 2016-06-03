'use strict'

const example = require('washington')
const assert = require('assert')
const createSubscription = require('./helpers/createSubscription')

const createSetupSubscriptions = require('../src/createSetupSubscriptions')

example('call dispatch with return value of each subscription, including multiple dispatch', () => {
  const firstAction = { the: 'firstAction' }
  const firstSubscription = () => firstAction
  const secondActions = [{ the: 'secondAction' }, { the: 'thirdAction' }]
  const secondSubscription = () => secondActions

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

  assert.equal(actions[0], firstAction)
  assert.equal(actions[1], secondActions[0])
  assert.equal(actions[2], secondActions[1])
})
