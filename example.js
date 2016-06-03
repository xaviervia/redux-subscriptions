import example from 'washington'
import { connect, getDiff } from './index'
import { createStore, compose } from 'redux'
import { deepEqual } from 'assert'
import { execSync } from 'child_process'

example(`save an item removed after it's is added`, (done) => {
  /* ACTIONS */
  const addItemActionCreator = (text) => ({
    type: 'ADD_ITEM',
    payload: {
      key: text,
      saved: false
    }
  })
  const itemSavedActionCreator = (key) => ({
    type: 'ITEM_SAVED',
    payload: key
  })

  /* EXTERNAL LIBRARY FOR A SIDE EFFECT */
  const asyncSaveFunction = (item, onSaved) => ({
    // We fake the asynchronous save request, which could for example
    // be calling a REST endpoint
    setTimeout(() => {
      console.log(`item('${item.text}') is saved now`)
      onSaved(item)
    }, 20)
  })

  /* REDUCER */
  const initialStore = { items: [] }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        return {
          items: [ ...state.items, action.payload ]
        }

      case 'ITEM_SAVED':
        return {
          items: [
            ...state.items.map((item) =>
              item.text === action.payload
                ? { ...item, saved: true }
                : item
            )
          ]
        }

      default:
        { items: [] }
    }
  }

  /* SELECTORS */
  const getItemTextsSelector = (state) => state && state.items.text

  /* SUBSCRIBER *new shiny thing*
   * you can think about this as something like a react-redux container
   * for arbitrary asynchronous side effects
   */
  const subscriber = ({ items, onSaved }) =>
    items.map((item) => asyncSaveFunction(item, onSaved))

  const mapStateToProps = (state, prevState) => {
    const newItemTexts = getDiff(getItemTextsSelector)
      (state, prevState).after

    return newItemTexts && {
      items: newItemTexts.map((text) =>
        state.items.find((item) => item.text === text)
      )
    }
  }

  const mapDispatchToProps = (dispatch, getState) => ({
    onSaved: (item) =>
      compose(dispatch, itemSavedActionCreator)(item.text)
  })

  const connectedSubscriber = connect(
    mapStateToProps,
    mapDispatchToProps
  )(subscriber)

  /* STORE */
  const store = createStore(reducer)

  // Connect the subscriber
  connectedSubscriber(store)

  // Start the thing by creating two items
  store.dispatch(addItemActionCreator('hello world of subscribers'))
  store.dispatch(addItemActionCreator('hola mundo de los subscribers'))

  /* ASSERTION */
  // Let's wait a couple of milliseconds for the asynchronous operations to
  // complete
  setTimeout(() => {
    deepEqual(
      getState().items,
      [
        {
          key: 'hello world of subscribers',
          saved: true
        },

        {
          key: 'hola mundo de los subscribers',
          saved: true
        }
      ]
    )
  }, 30)
})

example(`it will show an error if you try to dispatch synchronously`)

example.go()
