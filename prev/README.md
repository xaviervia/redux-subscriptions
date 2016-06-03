# redux-subscriptions

Higher-level API for the Redux `store.subscribe`.

`redux-subscriptions` keeps the previous state for you and gives you the ability of running diffs in the state (using [`object-difference`](https://github.com/xaviervia/object-difference)) so that you can do something when part of the state is updated, much like the React bindings for Redux work.

It allows you to bundle subscriptions in an elegant way and dispatch subsequent actions without having to explicitly reference `dispatch`.

> Be mindful that `object-difference` has some limitations. You can always do the diff manually using the `prevState` and `newState`.

## Installation

```sh
npm install --save redux-subscriptions
```

## Usage

```javascript
import setupSubscriptions = require('redux-subscriptions')
import { createStore } from 'redux'

const store = createStore(/* some reducer */)

// Each subscription function is called each time the store
// is updated
store.subscribe(setupSubscriptions(store)(
  ({ newState }) => {
    console.log('We got a new state', newState)
  },

  ({ prevState, newState }) => {
    if (prevState.backendCallStarted === false &&
        newState.backendCallStarted === true) {

      // This action will be dispatched right away
      // Be mindful of limitations stated here:
      // http://redux.js.org/docs/api/Store.html#subscribe
      return {
        type: 'SET_AS_LOADING',
        payload
      }    
    }
  },

  () => {
    // You can dispatch multiple actions
    return [
      { type: 'FIRST_ACTION' },
      { type: 'SECOND_ACTION' }
    ]
  },

  ({ getDiff }) => {
    // Here you can get the diff object for the state as specified
    // in https://github.com/xaviervia/object-difference
    //
    // Bear in mind that the following is unsafe: diffs can be `undefined`
    // if nothing changed, then the deconstruction will throw an exception
    const [removed, added] = getDiff()

    if (removed.username) {
      console.log('The user logged out')
    } else if (added.username) {
      console.log(`User ${added.username} logged in`)
    }
  },

  ({ getDiff }) => {
    // You can scope the diffs to optimize the computation
    const selectorForPosts = (state) => state && state.posts

    const [removedPosts, addedPosts] = getDiff(selectorForPosts)
  },

  ({ dispatch }) => {
    // You can dispatch manually if you really need to
    setTimeout(
      () => dispatch({ type: 'ASYNC_ACTION' }),
      1000
    )
  }
))
```

## License

See [License](LICENSE) attached.
