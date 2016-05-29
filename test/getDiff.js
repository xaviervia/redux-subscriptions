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

const before = { the: 'before' }
const after = { the: 'after' }
const value = [before, after]

example('passing selector, getDiff calls diff function with result of selector on both and returns the diff function result, mapped to "before" and "after"', () => {
  let state
  const selector = (state) => state && state.the
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

  assert.equal(firstSubscription.resultingDiff.before, before)
  assert.equal(firstSubscription.resultingDiff.after, after)
})

example('with not selector, getDiff calls diff function with both states and returns the diff function result', () => {
  let state
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

  assert.equal(firstSubscription.resultingDiff.before, before)
  assert.equal(firstSubscription.resultingDiff.after, after)
})

example('when there is no diff, instead of undefined result we get an undefined before and undefined after, to maintain object signature', () => {
  let state
  const diffFunctionMock = (selectedPrevState, selectedNewState) => {
    diffFunctionMock.selectedPrevState = selectedPrevState
    diffFunctionMock.selectedNewState = selectedNewState

    return undefined
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

  assert.equal(firstSubscription.resultingDiff.before, undefined)
  assert.equal(firstSubscription.resultingDiff.after, undefined)
})
