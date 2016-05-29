'use strict'

const objectDifference = require('object-difference')

const createSetupSubscriptions = () => {
  let prevState

  return (store) => {
    prevState = store.getState()

    return function () {
      const subscriptions = 'a'.repeat(arguments.length).split('')
        .map((_, index) => arguments[index])

      return function () {
        const newState = store.getState()

        const getDiff = (selector, getDifference) => {
          const theSelector = selector
            ? selector
            : x => x

          const theDifference = getDifference
            ? getDifference
            : objectDifference

          const difference = theDifference(
            theSelector(prevState),
            theSelector(newState)
          )

          return difference === undefined
            ? { before: undefined, after: undefined }
            : { before: difference[0], after: difference[1] }
        }

        subscriptions
          .map(subscription => subscription({
            dispatch: store.dispatch,
            newState,
            prevState,
            getDiff
          }))
          .filter(action => action != null)
          .reduce((actions, item) => actions.concat(item), [])
          .forEach(store.dispatch)

        prevState = newState
      }
    }
  }
}

module.exports = createSetupSubscriptions
