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

example('passing selector, getDiff calls diff function with result of selector on both and returns the diff function result', () => {
  let state
  const selector = (state) => state && state.the
  const value = {}
  const diffFunctionMock = (selectedPrevState, selectedNewState) => {
    diffFunctionMock.selectedPrevState = selectedPrevState
    diffFunctionMock.selectedNewState = selectedNewState

    return value
  }

  const firstSubscription = (args) => {
    firstSubscription.resultingDiff = args.getDiff(selector, diffFunctionMock)
  }

  const store = {
    dispatch: () => {},
    getState: () => state
  }

  state = states[0]
  const subscriptions = createSetupSubscriptions()(store)(
    firstSubscription
  )

  state = states[1]
  subscriptions()

  state = states[2]
  subscriptions()

  assert.equal(diffFunctionMock.selectedPrevState, states[1].the)
  assert.equal(diffFunctionMock.selectedNewState, states[2].the)

  assert.equal(firstSubscription.resultingDiff, value)
})

example('with not selector, getDiff calls diff function with both states and returns the diff function result', () => {
  let state
  const selector = (state) => state && state.the
  const value = {}
  const diffFunctionMock = (selectedPrevState, selectedNewState) => {
    diffFunctionMock.selectedPrevState = selectedPrevState
    diffFunctionMock.selectedNewState = selectedNewState

    return value
  }

  const firstSubscription = (args) => {
    firstSubscription.resultingDiff = args.getDiff(undefined, diffFunctionMock)
  }

  const store = {
    dispatch: () => {},
    getState: () => state
  }

  state = states[0]
  const subscriptions = createSetupSubscriptions()(store)(
    firstSubscription
  )

  state = states[1]
  subscriptions()

  state = states[2]
  subscriptions()

  assert.equal(diffFunctionMock.selectedPrevState, states[1])
  assert.equal(diffFunctionMock.selectedNewState, states[2])

  assert.equal(firstSubscription.resultingDiff, value)
})
